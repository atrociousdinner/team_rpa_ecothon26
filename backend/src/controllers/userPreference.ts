import { Response } from 'express';
import pool from '../db/setupDB';
import { CustomRequest } from '../@types/express';

interface UserPreferences {
  animalEthics: string[];
  certifications: string[];
  productType: string[];
  packaging: string[];
  materialSafety: string[];
  distancePreference: string[];
  additiveAwareness: string[];
}

// Helper function to get or create attribute IDs
const getOrCreateAttributeId = async (category: string, value: string): Promise<number> => {
  const client = await pool.connect();
  try {
    // Check if attribute exists
    const existingAttribute = await client.query(
      'SELECT attribute_id FROM attributes WHERE category = $1 AND value = $2',
      [category, value]
    );

    if (existingAttribute.rows.length > 0) {
       return existingAttribute.rows[0].attribute_id;
    }

    // Create new attribute if it doesn't exist
    const displayName = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const newAttribute = await client.query(
      'INSERT INTO attributes (category, value, display_name) VALUES ($1, $2, $3) RETURNING attribute_id',
      [category, value, displayName]
    );

    return newAttribute.rows[0].attribute_id;
  } finally {
    client.release();
  }
};

export const setUserPreferences = async (req: CustomRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  
  try {
    const userId = req.findUser?.userId;
    const preferences: UserPreferences = req.body;

    if (!userId) {
      res.status(401).json({
        status: false,
        message: 'User not authenticated'
      });
      return;
    }

    // Check if preferences object exists and is not null
    if (!preferences || typeof preferences !== 'object') {
      res.status(400).json({
        status: false,
        message: 'Invalid preferences data'
      });
      return;
    }

    // Validate preferences structure
    const expectedCategories = [
      'animalEthics',
      'certifications', 
      'productType',
      'packaging',
      'materialSafety',
      'distancePreference',
      'additiveAwareness'
    ];

    const invalidCategories = Object.keys(preferences).filter(
      key => !expectedCategories.includes(key)
    );

    if (invalidCategories.length > 0) {
      res.status(400).json({
        status: false,
        message: `Invalid preference categories: ${invalidCategories.join(', ')}`
      });
      return;
    }

    await client.query('BEGIN');

    // Clear existing preferences for this user
    await client.query(
      'DELETE FROM user_preferences WHERE user_id = $1',
      [userId]
    );

    // Process each preference category
    for (const [category, values] of Object.entries(preferences)) {
      if (Array.isArray(values) && values.length > 0) {
        for (const value of values) {
          if (typeof value === 'string' && value.trim()) {
            const attributeId = await getOrCreateAttributeId(category, value);
            
            // Insert user preference
            await client.query(
              'INSERT INTO user_preferences (user_id, attribute_id) VALUES ($1, $2)',
              [userId, attributeId]
            );
          }
        }
      }
    }

    await client.query('COMMIT');

    res.json({
      status: true,
      message: 'Preferences saved successfully',
      data: {
        userId,
        preferencesCount: Object.values(preferences).flat().length
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving user preferences:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error while saving preferences'
    });
  } finally {
    client.release();
  }
};

export const getUserPreferences = async (req: CustomRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  
  try {
    const userId = req.findUser?.userId;
    
    if (!userId) {
      res.status(401).json({
        status: false,
        message: 'User not found or not authenticated'
      });
      return;
    }

    const query = `
      SELECT 
        a.category,
        a.value,
        a.display_name,
        up.created_at as preference_created_at
      FROM user_preferences up
      JOIN attributes a ON up.attribute_id = a.attribute_id
      WHERE up.user_id = $1
      ORDER BY a.category, a.value
    `;
    
    const result = await client.query(query, [userId]);
    
    // Initialize preferences with empty arrays
    const preferences: UserPreferences = {
      animalEthics: [],
      certifications: [],
      productType: [],
      packaging: [],
      materialSafety: [],
      distancePreference: [],
      additiveAwareness: []
    };
    
    // Group preferences by category
    result.rows.forEach((row: any) => {
      const category = row.category as keyof UserPreferences;
      if (preferences[category]) {
        preferences[category].push(row.value);
      }
    });
    
    res.status(200).json({
      status: true,
      message: 'Preferences retrieved successfully',
      data: preferences
    });
    
  } catch (error) {
    console.error('Error in getUserPreferences:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve preferences',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
};

export const checkUserPreferences = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.findUser?.userId;

    // Validate userId
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const result = await pool.query('SELECT user_id FROM user_preferences WHERE user_id = $1', [userId]);
    const exists = result.rows.length > 0;

    res.status(200).json({
      success: true,
      exists: exists,
      message: exists ? 'User found in preferences' : 'User not found in preferences'
    });
    return;
  } catch (error) {
    console.error('Error checking user preferences:', error);
    res.status(500).json({
      success: false,
      exists: false,
      message: 'Internal server error'
    });
    return;
  }
};