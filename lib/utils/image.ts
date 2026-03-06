/**
 * Utility functions for handling image URLs
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

/**
 * Converts a relative or absolute image path to a full backend URL
 * @param imagePath - The image path from the API (e.g., "/uploads/image.jpg" or "uploads/image.jpg")
 * @returns Full URL to the image on the backend server
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    
    // If it's already a full URL (http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Construct full URL
    return `${BACKEND_URL}/${cleanPath}`;
}

/**
 * Gets a profile picture URL or returns a fallback avatar
 * @param profilePicture - The profile picture path
 * @param fullName - User's full name for generating avatar
 * @returns Image URL or avatar URL
 */
export function getProfilePictureUrl(profilePicture: string | null | undefined, fullName: string = 'User'): string {
    const imageUrl = getImageUrl(profilePicture);
    
    if (imageUrl) {
        return imageUrl;
    }
    
    // Generate avatar URL as fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
}

/**
 * Gets a campaign image URL or returns a fallback placeholder
 * @param campaignImage - The campaign image path
 * @returns Image URL or placeholder URL
 */
export function getCampaignImageUrl(campaignImage: string | null | undefined): string {
    const imageUrl = getImageUrl(campaignImage);
    
    if (imageUrl) {
        return imageUrl;
    }
    
    // Return a placeholder image
    return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop';
}
