# Google Maps & Reviews Integration Guide

This guide will help you pin your business location on the map and integrate Google reviews into your website.

---

## 📍 Part 1: Pin Your Business Location on Google Maps

### Option A: Use Google My Business (Recommended)

1. **Claim Your Business on Google My Business**
   - Go to [Google Business Profile](https://www.google.com/business/)
   - Sign in with your Google account
   - Click "Add your business to Google"
   - Enter your business name: "AR Car Rentals"
   - Add your business address in Cebu
   - Verify your business (Google will send a postcard with a verification code)

2. **Get the Embed Code**
   - Once verified, search for "AR Car Rentals" on Google Maps
   - Click on your business listing
   - Click "Share" button
   - Select "Embed a map" tab
   - Copy the iframe code
   - Replace the current iframe src in `AboutUsPage.tsx` (line ~197)

### Option B: Create a Custom Map Pin (If you don't have Google My Business yet)

1. **Find Your Business Location**
   - Go to [Google Maps](https://maps.google.com)
   - Search for your exact business address
   - Or right-click on the map where your business is located
   - Click "What's here?" to get the coordinates

2. **Generate Embed Code**
   - Click the menu (☰) on the left
   - Click "Share or embed map"
   - Select "Embed a map" tab
   - Choose map size (we recommend Custom size: 1600x500)
   - Copy the iframe code

3. **Update Your Website**
   - Open `src/pages/AboutUsPage.tsx`
   - Find line ~193 (the iframe with Google Maps)
   - Replace the `src` attribute with your new embed URL

**Example of what to replace:**
```tsx
// BEFORE (current generic Cebu City map)
src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125429..."

// AFTER (your specific business location)
src="YOUR_NEW_EMBED_URL_FROM_GOOGLE_MAPS"
```

### Option C: Use Exact Coordinates

If you know your exact coordinates:
1. Get your business coordinates (latitude and longitude)
2. Use this format: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925!2d123.XXXXXX!3d10.XXXXXX!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sYOUR_PLACE_ID!2sAR%20Car%20Rentals!5e0!3m2!1sen!2sph!4v1707357600000!5m2!1sen!2sph`
3. Replace the coordinates with your actual business location

---

## ⭐ Part 2: Integrate Google Reviews

There are several ways to display Google reviews on your website:

### Option A: Google Reviews API (Official - Requires API Key)

**Step 1: Set up Google Places API**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your existing project
3. Enable "Places API" 
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Restrict your API key (recommended):
   - Application restrictions: HTTP referrers
   - Add your website domain
   - API restrictions: Select "Places API"

**Step 2: Get Your Place ID**
1. Go to [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
2. Search for "AR Car Rentals Cebu"
3. Copy your Place ID (starts with "ChIJ...")

**Step 3: Install Required Package**
```bash
npm install @googlemaps/google-maps-services-js
```

**Step 4: Create a Google Reviews Service**

Create file: `src/services/googleReviewsService.ts`
```typescript
// Google Reviews Service
const GOOGLE_PLACES_API_KEY = 'YOUR_API_KEY_HERE';
const PLACE_ID = 'YOUR_PLACE_ID_HERE';

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export const fetchGoogleReviews = async (): Promise<GoogleReview[]> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`,
      { mode: 'cors' }
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.result.reviews || [];
    }
    
    console.error('Google Places API error:', data.status);
    return [];
  } catch (error) {
    console.error('Failed to fetch Google reviews:', error);
    return [];
  }
};
```

**Step 5: Update AboutUsPage to Use Live Reviews**

In `src/pages/AboutUsPage.tsx`, add:
```typescript
import { useState, useEffect } from 'react';
import { fetchGoogleReviews, type GoogleReview } from '@/services/googleReviewsService';

// Inside the component:
const [reviews, setReviews] = useState<GoogleReview[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadReviews = async () => {
    const googleReviews = await fetchGoogleReviews();
    setReviews(googleReviews);
    setLoading(false);
  };
  
  loadReviews();
}, []);

// Then map over `reviews` instead of the hardcoded `testimonials`
```

### Option B: Third-Party Widget (Easiest - No coding required)

**EmbedSocial (Free tier available)**
1. Go to [EmbedSocial](https://embedsocial.com/products/reviews/)
2. Sign up for free account
3. Connect your Google Business Profile
4. Customize the widget design
5. Copy the embed code
6. Add to your AboutUsPage

**Elfsight (Paid but professional)**
1. Go to [Elfsight Google Reviews](https://elfsight.com/google-reviews-widget/)
2. Create widget and customize
3. Get embed code
4. Add to your website

### Option C: Manual Update (Simplest)

Periodically copy reviews from your Google Business Profile and update the testimonials array in `AboutUsPage.tsx`:

```typescript
const testimonials = [
  {
    initials: 'JD',
    name: 'John Doe', // From Google review
    company: 'Google Review',
    quote: 'Amazing service! Best car rental in Cebu...' // Copy from Google
  },
  // Add more from your Google reviews
];
```

---

## 🔧 Quick Setup Instructions

### To Update Your Map Location NOW:

1. Open `src/pages/AboutUsPage.tsx`
2. Go to line ~193
3. Replace the iframe `src` with one of these methods:

**Method 1: Use Address**
```typescript
src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=YOUR_EXACT_ADDRESS_CEBU"
```

**Method 2: Use Coordinates** (Replace with your actual coordinates)
```typescript
src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3925.123456789!2d123.9123456!3d10.3123456!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDE4JzQ0LjQiTiAxMjPCsDU0JzQ0LjQiRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph"
```

### To Get Your Coordinates:
1. Go to Google Maps
2. Right-click on your business location
3. Click the coordinates (they look like: 10.123456, 123.123456)
4. They'll be copied to clipboard

---

## 📝 Recommended Approach

1. **Immediate (5 minutes):**
   - Find your business on Google Maps
   - Get the embed code
   - Update AboutUsPage.tsx

2. **Short-term (1-2 days):**
   - Claim your Google My Business listing
   - Verify your business
   - Get official embed code with your business marker

3. **Long-term (1 week):**
   - Set up Google Places API
   - Integrate live Google reviews
   - Display real-time ratings and feedback

---

## 🆘 Need Help?

If you need immediate assistance:
1. Share your exact business address
2. I can help generate the correct embed code
3. I can help set up the Google Reviews integration

Let me know which option you'd like to proceed with!
