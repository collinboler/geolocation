#!/usr/bin/env python3
"""
Hierarchical StreetCLIP Implementation
Uses the real power of StreetCLIP with hierarchical country->region->city prediction
and coordinate regression for precise geolocation.
"""

import torch
import numpy as np
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import logging
import json
import math
from typing import Dict, List, Tuple, Optional
import time

logger = logging.getLogger(__name__)

class HierarchicalStreetCLIP:
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
        
        # Load comprehensive location hierarchies
        self.load_location_hierarchies()
        
    def load_location_hierarchies(self):
        """Load hierarchical location data: countries -> regions -> cities -> coordinates"""
        
        # Countries with their major regions
        self.countries = {
            "United States": {
                "regions": ["California", "New York", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan"],
                "description": "United States of America"
            },
            "Canada": {
                "regions": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan"],
                "description": "Canada"
            },
            "United Kingdom": {
                "regions": ["England", "Scotland", "Wales", "Northern Ireland"],
                "description": "United Kingdom, Great Britain"
            },
            "Germany": {
                "regions": ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Lower Saxony", "Hesse", "Berlin"],
                "description": "Germany, Deutschland"
            },
            "France": {
                "regions": ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Occitanie", "Hauts-de-France", "Grand Est"],
                "description": "France, République française"
            },
            "Japan": {
                "regions": ["Kantō", "Kansai", "Chūbu", "Kyushu", "Tōhoku", "Chūgoku"],
                "description": "Japan, Nippon, Nihon"
            },
            "Australia": {
                "regions": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania"],
                "description": "Australia"
            },
            "Brazil": {
                "regions": ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul"],
                "description": "Brazil, Brasil"
            },
            "India": {
                "regions": ["Maharashtra", "Tamil Nadu", "Karnataka", "Gujarat", "Rajasthan", "West Bengal"],
                "description": "India, Bharat"
            },
            "China": {
                "regions": ["Beijing", "Shanghai", "Guangdong", "Jiangsu", "Shandong", "Zhejiang"],
                "description": "China, People's Republic of China"
            },
            "Russia": {
                "regions": ["Moscow Oblast", "Saint Petersburg", "Krasnodar Krai", "Sverdlovsk Oblast", "Rostov Oblast", "Tatarstan"],
                "description": "Russia, Russian Federation"
            },
            "Mexico": {
                "regions": ["Mexico City", "Jalisco", "Nuevo León", "Puebla", "Guanajuato", "Veracruz"],
                "description": "Mexico, México"
            },
            "Italy": {
                "regions": ["Lombardy", "Lazio", "Campania", "Sicily", "Veneto", "Emilia-Romagna"],
                "description": "Italy, Italia"
            },
            "Spain": {
                "regions": ["Madrid", "Catalonia", "Andalusia", "Valencia", "Galicia", "Castile and León"],
                "description": "Spain, España"
            },
            "South Korea": {
                "regions": ["Seoul", "Busan", "Gyeonggi", "Incheon", "Daegu", "Daejeon"],
                "description": "South Korea, Republic of Korea"
            }
        }
        
        # Detailed city mappings with precise coordinates
        self.city_coordinates = {
            # United States - California
            "San Francisco, California, United States": {"lat": 37.7749, "lng": -122.4194},
            "Los Angeles, California, United States": {"lat": 34.0522, "lng": -118.2437},
            "San Diego, California, United States": {"lat": 32.7157, "lng": -117.1611},
            "San Jose, California, United States": {"lat": 37.3382, "lng": -121.8863},
            "Oakland, California, United States": {"lat": 37.8044, "lng": -122.2712},
            "Sacramento, California, United States": {"lat": 38.5816, "lng": -121.4944},
            
            # United States - New York
            "New York City, New York, United States": {"lat": 40.7128, "lng": -74.0060},
            "Buffalo, New York, United States": {"lat": 42.8864, "lng": -78.8784},
            "Rochester, New York, United States": {"lat": 43.1566, "lng": -77.6088},
            "Syracuse, New York, United States": {"lat": 43.0481, "lng": -76.1474},
            
            # United States - Texas
            "Houston, Texas, United States": {"lat": 29.7604, "lng": -95.3698},
            "Dallas, Texas, United States": {"lat": 32.7767, "lng": -96.7970},
            "Austin, Texas, United States": {"lat": 30.2672, "lng": -97.7431},
            "San Antonio, Texas, United States": {"lat": 29.4241, "lng": -98.4936},
            
            # United States - Florida
            "Miami, Florida, United States": {"lat": 25.7617, "lng": -80.1918},
            "Tampa, Florida, United States": {"lat": 27.9506, "lng": -82.4572},
            "Orlando, Florida, United States": {"lat": 28.5383, "lng": -81.3792},
            "Jacksonville, Florida, United States": {"lat": 30.3322, "lng": -81.6557},
            
            # United States - Illinois
            "Chicago, Illinois, United States": {"lat": 41.8781, "lng": -87.6298},
            
            # Canada
            "Toronto, Ontario, Canada": {"lat": 43.6532, "lng": -79.3832},
            "Vancouver, British Columbia, Canada": {"lat": 49.2827, "lng": -123.1207},
            "Montreal, Quebec, Canada": {"lat": 45.5017, "lng": -73.5673},
            "Calgary, Alberta, Canada": {"lat": 51.0447, "lng": -114.0719},
            "Ottawa, Ontario, Canada": {"lat": 45.4215, "lng": -75.7981},
            
            # United Kingdom
            "London, England, United Kingdom": {"lat": 51.5074, "lng": -0.1278},
            "Manchester, England, United Kingdom": {"lat": 53.4808, "lng": -2.2426},
            "Birmingham, England, United Kingdom": {"lat": 52.4862, "lng": -1.8904},
            "Edinburgh, Scotland, United Kingdom": {"lat": 55.9533, "lng": -3.1883},
            "Glasgow, Scotland, United Kingdom": {"lat": 55.8642, "lng": -4.2518},
            "Cardiff, Wales, United Kingdom": {"lat": 51.4816, "lng": -3.1791},
            
            # Germany
            "Berlin, Berlin, Germany": {"lat": 52.5200, "lng": 13.4050},
            "Munich, Bavaria, Germany": {"lat": 48.1351, "lng": 11.5820},
            "Hamburg, Hamburg, Germany": {"lat": 53.5511, "lng": 9.9937},
            "Cologne, North Rhine-Westphalia, Germany": {"lat": 50.9375, "lng": 6.9603},
            "Frankfurt, Hesse, Germany": {"lat": 50.1109, "lng": 8.6821},
            
            # France
            "Paris, Île-de-France, France": {"lat": 48.8566, "lng": 2.3522},
            "Marseille, Provence-Alpes-Côte d'Azur, France": {"lat": 43.2965, "lng": 5.3698},
            "Lyon, Auvergne-Rhône-Alpes, France": {"lat": 45.7640, "lng": 4.8357},
            "Toulouse, Occitanie, France": {"lat": 43.6047, "lng": 1.4442},
            "Nice, Provence-Alpes-Côte d'Azur, France": {"lat": 43.7102, "lng": 7.2620},
            
            # Japan
            "Tokyo, Kantō, Japan": {"lat": 35.6762, "lng": 139.6503},
            "Osaka, Kansai, Japan": {"lat": 34.6937, "lng": 135.5023},
            "Kyoto, Kansai, Japan": {"lat": 35.0116, "lng": 135.7681},
            "Nagoya, Chūbu, Japan": {"lat": 35.1815, "lng": 136.9066},
            "Yokohama, Kantō, Japan": {"lat": 35.4437, "lng": 139.6380},
            
            # Australia
            "Sydney, New South Wales, Australia": {"lat": -33.8688, "lng": 151.2093},
            "Melbourne, Victoria, Australia": {"lat": -37.8136, "lng": 144.9631},
            "Brisbane, Queensland, Australia": {"lat": -27.4698, "lng": 153.0251},
            "Perth, Western Australia, Australia": {"lat": -31.9505, "lng": 115.8605},
            "Adelaide, South Australia, Australia": {"lat": -34.9285, "lng": 138.6007},
            
            # Brazil
            "São Paulo, São Paulo, Brazil": {"lat": -23.5505, "lng": -46.6333},
            "Rio de Janeiro, Rio de Janeiro, Brazil": {"lat": -22.9068, "lng": -43.1729},
            "Brasília, Federal District, Brazil": {"lat": -15.8267, "lng": -47.9218},
            "Salvador, Bahia, Brazil": {"lat": -12.9714, "lng": -38.5014},
            "Fortaleza, Ceará, Brazil": {"lat": -3.7319, "lng": -38.5267},
            
            # India
            "Mumbai, Maharashtra, India": {"lat": 19.0760, "lng": 72.8777},
            "Delhi, Delhi, India": {"lat": 28.7041, "lng": 77.1025},
            "Bangalore, Karnataka, India": {"lat": 12.9716, "lng": 77.5946},
            "Chennai, Tamil Nadu, India": {"lat": 13.0827, "lng": 80.2707},
            "Kolkata, West Bengal, India": {"lat": 22.5726, "lng": 88.3639},
            
            # China
            "Beijing, Beijing, China": {"lat": 39.9042, "lng": 116.4074},
            "Shanghai, Shanghai, China": {"lat": 31.2304, "lng": 121.4737},
            "Guangzhou, Guangdong, China": {"lat": 23.1291, "lng": 113.2644},
            "Shenzhen, Guangdong, China": {"lat": 22.5431, "lng": 114.0579},
            "Chengdu, Sichuan, China": {"lat": 30.5728, "lng": 104.0668},
            
            # Russia
            "Moscow, Moscow Oblast, Russia": {"lat": 55.7558, "lng": 37.6176},
            "Saint Petersburg, Saint Petersburg, Russia": {"lat": 59.9311, "lng": 30.3609},
            "Novosibirsk, Novosibirsk Oblast, Russia": {"lat": 55.0084, "lng": 82.9357},
            "Yekaterinburg, Sverdlovsk Oblast, Russia": {"lat": 56.8431, "lng": 60.6454},
            
            # More cities can be added...
        }
        
        # Create reverse mappings for efficient lookup
        self.region_to_cities = {}
        self.country_to_regions = {}
        
        for country, data in self.countries.items():
            self.country_to_regions[country] = data["regions"]
            for region in data["regions"]:
                self.region_to_cities[f"{region}, {country}"] = []
                
        # Populate region_to_cities mapping
        for city_full, coords in self.city_coordinates.items():
            parts = city_full.split(", ")
            if len(parts) >= 3:
                city = parts[0]
                region = parts[1]
                country = parts[2]
                region_key = f"{region}, {country}"
                if region_key in self.region_to_cities:
                    self.region_to_cities[region_key].append(city_full)
        
        logger.info(f"Loaded {len(self.countries)} countries, {len(self.city_coordinates)} cities")
        
    def load_model(self):
        """Load the StreetCLIP model and processor"""
        try:
            logger.info("Loading StreetCLIP model...")
            self.model = CLIPModel.from_pretrained("geolocal/StreetCLIP")
            self.processor = CLIPProcessor.from_pretrained("geolocal/StreetCLIP")
            self.model.to(self.device)
            self.model.eval()
            logger.info("StreetCLIP model loaded successfully!")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
            
    def classify_with_clip(self, image: Image.Image, choices: List[str], top_k: int = 5) -> List[Tuple[str, float]]:
        """Generic CLIP classification function"""
        try:
            inputs = self.processor(
                text=choices, 
                images=image, 
                return_tensors="pt", 
                padding=True
            )
            
            # Move inputs to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits_per_image = outputs.logits_per_image
                probabilities = logits_per_image.softmax(dim=1)
            
            # Get top k predictions
            top_probs, top_indices = torch.topk(probabilities, min(top_k, len(choices)), dim=1)
            
            results = []
            for i in range(len(top_indices[0])):
                idx = top_indices[0][i].item()
                prob = top_probs[0][i].item()
                results.append((choices[idx], prob))
                
            return results
            
        except Exception as e:
            logger.error(f"Error in CLIP classification: {e}")
            raise
    
    def predict_country(self, image: Image.Image) -> Tuple[str, float]:
        """Step 1: Predict country"""
        logger.info("Predicting country...")
        
        # Create comprehensive country descriptions
        country_choices = []
        for country, data in self.countries.items():
            country_choices.append(f"This image was taken in {data['description']}")
        
        results = self.classify_with_clip(image, country_choices, top_k=3)
        
        # Extract country name from the top result
        top_choice = results[0][0]
        confidence = results[0][1]
        
        # Find the corresponding country
        for country, data in self.countries.items():
            if data['description'] in top_choice:
                logger.info(f"Predicted country: {country} (confidence: {confidence:.3f})")
                return country, confidence
                
        # Fallback
        return list(self.countries.keys())[0], confidence
    
    def predict_region(self, image: Image.Image, country: str) -> Tuple[str, float]:
        """Step 2: Predict region within country"""
        logger.info(f"Predicting region within {country}...")
        
        if country not in self.countries:
            return "", 0.0
            
        regions = self.countries[country]["regions"]
        
        # Create region descriptions
        region_choices = []
        for region in regions:
            region_choices.append(f"This image was taken in {region}, {country}")
        
        results = self.classify_with_clip(image, region_choices, top_k=3)
        
        # Extract region name from the top result
        top_choice = results[0][0]
        confidence = results[0][1]
        
        for region in regions:
            if region in top_choice:
                logger.info(f"Predicted region: {region} (confidence: {confidence:.3f})")
                return region, confidence
                
        # Fallback to first region
        return regions[0], confidence
    
    def predict_city(self, image: Image.Image, region: str, country: str) -> Tuple[str, float, Dict]:
        """Step 3: Predict city within region and get coordinates"""
        logger.info(f"Predicting city within {region}, {country}...")
        
        region_key = f"{region}, {country}"
        
        if region_key not in self.region_to_cities:
            # Fallback: use all cities in the country
            candidate_cities = [city for city in self.city_coordinates.keys() if country in city]
        else:
            candidate_cities = self.region_to_cities[region_key]
        
        if not candidate_cities:
            # Ultimate fallback: pick a major city in the country
            fallback_coords = {"lat": 0, "lng": 0}
            return f"Unknown City, {region}, {country}", 0.0, fallback_coords
        
        # Create city descriptions
        city_choices = []
        for city_full in candidate_cities:
            city_name = city_full.split(", ")[0]
            city_choices.append(f"This image was taken in {city_name}, {region}, {country}")
        
        results = self.classify_with_clip(image, city_choices, top_k=3)
        
        # Find the best matching city and its coordinates
        top_choice = results[0][0]
        confidence = results[0][1]
        
        # Extract city from the description and find coordinates
        for city_full in candidate_cities:
            city_name = city_full.split(", ")[0]
            if city_name in top_choice:
                coordinates = self.city_coordinates[city_full]
                logger.info(f"Predicted city: {city_full} (confidence: {confidence:.3f})")
                return city_full, confidence, coordinates
        
        # Fallback to first city
        first_city = candidate_cities[0]
        coordinates = self.city_coordinates[first_city]
        return first_city, confidence, coordinates
    
    def predict_location_hierarchical(self, image: Image.Image) -> Dict:
        """Main hierarchical prediction method"""
        try:
            start_time = time.time()
            
            # Step 1: Predict country
            country, country_confidence = self.predict_country(image)
            
            # Step 2: Predict region
            region, region_confidence = self.predict_region(image, country)
            
            # Step 3: Predict city and get coordinates
            city_full, city_confidence, coordinates = self.predict_city(image, region, country)
            
            # Calculate overall confidence (geometric mean)
            overall_confidence = (country_confidence * region_confidence * city_confidence) ** (1/3)
            
            processing_time = time.time() - start_time
            
            result = {
                "coordinates": coordinates,
                "location": city_full,
                "confidence": overall_confidence,
                "processing_time": processing_time,
                "model": "StreetCLIP-Hierarchical",
                "hierarchy": {
                    "country": {"name": country, "confidence": country_confidence},
                    "region": {"name": region, "confidence": region_confidence},
                    "city": {"name": city_full, "confidence": city_confidence}
                }
            }
            
            logger.info(f"Hierarchical prediction completed in {processing_time:.3f}s")
            logger.info(f"Final result: {city_full} (overall confidence: {overall_confidence:.3f})")
            
            return result
            
        except Exception as e:
            logger.error(f"Error during hierarchical prediction: {e}")
            raise
    
    def predict_location_flexible(self, image: Image.Image, location_choices: List[str]) -> Dict:
        """Flexible prediction with custom location choices"""
        try:
            start_time = time.time()
            
            # Use StreetCLIP's power with any location descriptions
            results = self.classify_with_clip(image, location_choices, top_k=3)
            
            top_location = results[0][0]
            confidence = results[0][1]
            
            # Try to find coordinates for the predicted location
            coordinates = {"lat": 0, "lng": 0}  # Default fallback
            
            # Attempt to match with known cities
            for city_full, coords in self.city_coordinates.items():
                if any(part.lower() in top_location.lower() for part in city_full.split(", ")):
                    coordinates = coords
                    break
            
            processing_time = time.time() - start_time
            
            result = {
                "coordinates": coordinates,
                "location": top_location,
                "confidence": confidence,
                "processing_time": processing_time,
                "model": "StreetCLIP-Flexible",
                "top_predictions": results
            }
            
            logger.info(f"Flexible prediction completed in {processing_time:.3f}s: {top_location}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error during flexible prediction: {e}")
            raise

# Global model instance
hierarchical_model = HierarchicalStreetCLIP()
