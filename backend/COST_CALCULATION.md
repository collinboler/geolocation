# OpenAI Vision Cost Calculation

This document explains how the Firebase Function calculates costs for OpenAI GPT-4o-mini vision API calls based on the official OpenAI pricing methodology.

## Implementation Overview

The cost calculation is implemented in `/functions/index.js` and follows the official OpenAI vision pricing documentation.

## Cost Calculation Process

### 1. Image Dimension Extraction
```javascript
const imageDimensions = await getImageDimensions(imageData);
```
- Uses **Sharp** library to extract width/height from base64 image data
- Falls back to 1920x1080 if extraction fails

### 2. Token Calculation for GPT-5 Mini
```javascript
const imageTokens = calculateImageTokenCost(width, height, "low");
```

**GPT-5 Mini Pricing:**
- **Patch-based calculation**: 32px × 32px patches
- **Token multiplier**: 1.2
- **Maximum patches**: 1536 (with scaling if exceeded)
- **Detail level**: "low" (for cost efficiency)

**Algorithm:**
1. Calculate raw patches: `ceil(width/32) × ceil(height/32)`
2. If patches > 1536, scale down the image proportionally
3. Cap at maximum of 1536 patches
4. Apply multiplier: `patches × 1.2`

### 3. Cost Calculation
```javascript
// GPT-5 Mini pricing (per 1M tokens)
const inputCost = (imageTokens * 0.25) / 1000000;   // $0.25 per 1M input tokens
const outputCost = (textTokens * 2.00) / 1000000;   // $2.00 per 1M output tokens
const totalCost = inputCost + outputCost;
```

## Example Calculations

### Example 1: 1132×823 image (from calculator)
1. **Raw patches**: ceil(1132/32) × ceil(823/32) = 36 × 26 = **936 patches**
2. **Within limit**: 936 < 1536, so no scaling needed
3. **Multiplier applied**: 936 × 1.2 = **1,123 tokens**
4. **Cost**: 1,123 × $0.25 / 1,000,000 = **~$0.000281**

### Example 2: 1920×1080 image  
1. **Raw patches**: ceil(1920/32) × ceil(1080/32) = 60 × 34 = **2,040 patches**
2. **Exceeds limit**: 2,040 > 1536, scale down to 1,536 patches max
3. **Multiplier applied**: 1,536 × 1.2 = **1,843 tokens**
4. **Cost**: 1,843 × $0.25 / 1,000,000 = **~$0.000461**

## Logging and Debugging

The function logs detailed token breakdown:
```javascript
console.log('Image token calculation:', {
  imageWidth: 1132,
  imageHeight: 823,
  rawPatches: 936,
  finalPatches: 936,
  imageTokens: 936,
  multiplier: 1.2,
  totalTokens: 1123
});

console.log('Token breakdown:', {
  imageTokens: 1123,
  textTokens: 150,
  totalTokens: 1273,
  inputCost: 0.000281,
  outputCost: 0.0003,
  totalCost: 0.000581
});
```

## Key Benefits

1. **Accurate Pricing**: Follows official OpenAI methodology exactly
2. **Detailed Logging**: Full cost breakdown for monitoring
3. **Fallback Handling**: Graceful degradation if image analysis fails
4. **Real-time Calculation**: Based on actual image dimensions, not estimates

## References

- [OpenAI Vision Pricing Documentation](https://platform.openai.com/docs/guides/images-vision)
- [OpenAI Pricing Calculator](https://openai.com/api/pricing/)
- GPT-5 Mini specific pricing: Input $0.25/1M tokens, Output $2.00/1M tokens
