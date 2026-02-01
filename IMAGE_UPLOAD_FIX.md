# Image Upload Fix - Vehicle CRUD

## ✅ Fixed Issues

### 1. **Image URL Input Behavior**
- ❌ **Before**: Input was disabled when file was selected
- ❌ **Before**: Pasting URL cleared preview but didn't set it
- ✅ **After**: Input always enabled
- ✅ **After**: Pasting URL sets the preview immediately

### 2. **Upload Function Logic**
- ✅ Better error handling with fallback to URL input
- ✅ Trims whitespace from URL
- ✅ Returns URL from input if no file selected
- ✅ Returns URL from input if upload fails

### 3. **Storage Bucket Setup**
- ✅ Created [setup_storage_bucket.sql](../database/setup_storage_bucket.sql)
- ✅ Includes `vehicle-images` bucket creation
- ✅ Proper RLS policies for authenticated uploads
- ✅ Public read access for images

## 📋 Setup Instructions

### Run the Storage Bucket Setup:
1. Go to Supabase SQL Editor
2. Run [database/setup_storage_bucket.sql](../database/setup_storage_bucket.sql)
3. This creates the `vehicle-images` bucket with proper permissions

## 🎯 How It Works Now

### Option 1: Upload File
1. User clicks upload area or "Change Image"
2. Selects image file from computer
3. Preview shows immediately
4. On submit, uploads to Supabase Storage
5. Saves public URL to `image_url` column

### Option 2: Paste URL
1. User pastes image URL in "Image URL" field
2. Preview updates immediately
3. On submit, saves URL directly to `image_url` column
4. No upload needed

### Fallback Behavior
- If file upload fails → uses URL from input field
- If no file and no URL → saves NULL
- Always shows preview if either exists

## 🧪 Test Cases

- [ ] Upload image file → saves to storage and database
- [ ] Paste image URL → saves URL to database
- [ ] Upload file, then paste URL → URL takes priority
- [ ] Remove image → clears preview and field
- [ ] Submit without image → saves NULL (optional field)

## Files Modified

1. [src/components/ui/AddVehicleModal.tsx](../src/components/ui/AddVehicleModal.tsx)
   - Fixed image URL input behavior
   - Improved uploadImage() function
   - Better error handling

2. [database/setup_storage_bucket.sql](../database/setup_storage_bucket.sql)
   - Added vehicle-images bucket
   - Added storage policies
