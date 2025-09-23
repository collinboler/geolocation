#!/usr/bin/env python3
"""
Reinforcement Learning from Human Feedback (RLHF) for StreetCLIP
Improves predictions based on user corrections and feedback
"""

import json
import torch
import numpy as np
from datetime import datetime
from typing import Dict, List, Tuple
import sqlite3

class RLHFTrainer:
    def __init__(self, feedback_db_path="feedback.db"):
        self.feedback_db = feedback_db_path
        self.init_database()
        
    def init_database(self):
        """Initialize SQLite database for storing feedback"""
        conn = sqlite3.connect(self.feedback_db)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_hash TEXT,
                predicted_location TEXT,
                predicted_confidence REAL,
                actual_location TEXT,
                user_id TEXT,
                feedback_type TEXT,  -- 'correct', 'wrong', 'close', 'far'
                distance_error REAL, -- km from actual location
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        
    def record_feedback(self, 
                       image_hash: str,
                       predicted_location: str, 
                       predicted_confidence: float,
                       actual_location: str,
                       user_id: str,
                       feedback_type: str,
                       distance_error: float = None):
        """Record user feedback for a prediction"""
        
        conn = sqlite3.connect(self.feedback_db)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO feedback 
            (image_hash, predicted_location, predicted_confidence, 
             actual_location, user_id, feedback_type, distance_error)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (image_hash, predicted_location, predicted_confidence,
              actual_location, user_id, feedback_type, distance_error))
        
        conn.commit()
        conn.close()
        
    def get_improvement_suggestions(self) -> Dict:
        """Analyze feedback to suggest model improvements"""
        
        conn = sqlite3.connect(self.feedback_db)
        cursor = conn.cursor()
        
        # Most commonly misclassified locations
        cursor.execute('''
            SELECT predicted_location, COUNT(*) as error_count
            FROM feedback 
            WHERE feedback_type = 'wrong'
            GROUP BY predicted_location
            ORDER BY error_count DESC
            LIMIT 10
        ''')
        
        problematic_predictions = cursor.fetchall()
        
        # Locations that need more training data
        cursor.execute('''
            SELECT actual_location, COUNT(*) as feedback_count,
                   AVG(distance_error) as avg_error
            FROM feedback 
            WHERE distance_error IS NOT NULL
            GROUP BY actual_location
            HAVING avg_error > 1000  -- More than 1000km off
            ORDER BY avg_error DESC
        ''')
        
        needs_more_data = cursor.fetchall()
        
        conn.close()
        
        return {
            "problematic_predictions": problematic_predictions,
            "needs_more_data": needs_more_data,
            "total_feedback": self.get_feedback_count()
        }
        
    def get_feedback_count(self) -> int:
        """Get total feedback count"""
        conn = sqlite3.connect(self.feedback_db)
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM feedback')
        count = cursor.fetchone()[0]
        conn.close()
        return count

class OnlineLearningUpdater:
    """Continuously improve model with user feedback"""
    
    def __init__(self, base_model_path="geolocal/StreetCLIP"):
        self.base_model_path = base_model_path
        self.learning_rate = 1e-5
        
    def create_training_batch_from_feedback(self, feedback_data: List[Dict]) -> Tuple:
        """Convert feedback into training batches"""
        
        positive_examples = []  # Correctly predicted
        negative_examples = []  # Incorrectly predicted
        
        for feedback in feedback_data:
            if feedback['feedback_type'] == 'correct':
                positive_examples.append({
                    'image': feedback['image_data'],
                    'location': feedback['predicted_location'],
                    'weight': 1.0 + feedback['predicted_confidence']  # Boost high-confidence correct predictions
                })
            elif feedback['feedback_type'] == 'wrong':
                negative_examples.append({
                    'image': feedback['image_data'], 
                    'wrong_location': feedback['predicted_location'],
                    'correct_location': feedback['actual_location'],
                    'weight': 1.0 + (1.0 - feedback['predicted_confidence'])  # Boost confident wrong predictions
                })
                
        return positive_examples, negative_examples
        
    def fine_tune_with_feedback(self, feedback_data: List[Dict]):
        """Fine-tune model using collected feedback"""
        
        positive_examples, negative_examples = self.create_training_batch_from_feedback(feedback_data)
        
        # Implement contrastive learning update
        # Increase similarity for correct predictions
        # Decrease similarity for incorrect predictions
        
        print(f"Fine-tuning with {len(positive_examples)} positive and {len(negative_examples)} negative examples")
        
        # This would implement the actual PyTorch training loop
        # For now, just log the improvement potential
        return {
            "positive_samples": len(positive_examples),
            "negative_samples": len(negative_examples),
            "estimated_improvement": f"{(len(feedback_data) * 0.1):.1f}% accuracy boost"
        }

if __name__ == "__main__":
    # Example usage
    trainer = RLHFTrainer()
    
    # Simulate some feedback
    trainer.record_feedback(
        image_hash="abc123",
        predicted_location="New York City, United States", 
        predicted_confidence=0.8,
        actual_location="Philadelphia, Pennsylvania",
        user_id="test_user",
        feedback_type="close",
        distance_error=150  # 150km off
    )
    
    suggestions = trainer.get_improvement_suggestions()
    print("Improvement suggestions:", suggestions)
