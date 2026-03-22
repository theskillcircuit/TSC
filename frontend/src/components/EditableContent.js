import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * EditableText Component
 * Shows a pen icon for admins to edit text inline
 * 
 * @param {string} page - The page name (home, about, courses, etc.)
 * @param {string} section - The section name (hero, stats, etc.)
 * @param {string} field - The field name (title, subtitle, etc.)
 * @param {string} defaultValue - Default text to show if no CMS value
 * @param {string} type - 'text' | 'textarea' | 'heading'
 * @param {string} className - Additional CSS classes
 * @param {React.Component} as - The HTML element to render as
 */
export const EditableText = ({ 
  page, 
  section, 
  field, 
  defaultValue = '', 
  type = 'text',
  className = '',
  as: Component = 'span',
  children
}) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [originalValue, setOriginalValue] = useState(defaultValue);
  const [saving, setSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch CMS value on mount
  useEffect(() => {
    const fetchValue = async () => {
      try {
        const response = await axios.get(`${API}/cms/${page}`);
        const cmsValue = response.data?.sections?.[section]?.[field];
        if (cmsValue) {
          setValue(cmsValue);
          setOriginalValue(cmsValue);
        }
      } catch (error) {
        // Use default value if CMS fetch fails
      }
    };
    fetchValue();
  }, [page, section, field]);

  const handleSave = async () => {
    if (value === originalValue) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // Get existing section content first
      const existingResponse = await axios.get(`${API}/cms/${page}`);
      const existingSection = existingResponse.data?.sections?.[section] || {};
      
      // Update with new field value
      await axios.put(
        `${API}/admin/cms`,
        {
          page,
          section,
          content: { ...existingSection, [field]: value }
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      setOriginalValue(value);
      setIsEditing(false);
      toast.success('Content updated successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(originalValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If not admin, just render the content
  if (!isAdmin) {
    return <Component className={className}>{children || value || defaultValue}</Component>;
  }

  // Admin view with edit capability
  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            {type === 'textarea' ? (
              <Textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-[300px] min-h-[100px] text-base border-2 border-[#f16a2f] rounded-lg p-3 focus:ring-2 focus:ring-[#f16a2f]/20"
                autoFocus
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`border-2 border-[#f16a2f] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#f16a2f]/20 ${
                  type === 'heading' ? 'text-2xl font-bold min-w-[400px]' : 'min-w-[200px]'
                }`}
                autoFocus
              />
            )}
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span className="ml-1">Save</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="rounded-full px-4"
              >
                <X className="w-4 h-4" />
                <span className="ml-1">Cancel</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <Component className={className}>{children || value || defaultValue}</Component>
            
            {/* Edit Icon */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              className="absolute -top-2 -right-8 w-7 h-7 bg-[#f16a2f] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#d65a25] transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Edit this content"
            >
              <Pencil className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * EditableImage Component
 * Shows a pen icon for admins to change images
 */
export const EditableImage = ({
  page,
  section,
  field,
  defaultSrc = '',
  alt = '',
  className = ''
}) => {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [src, setSrc] = useState(defaultSrc);
  const [tempSrc, setTempSrc] = useState(defaultSrc);
  const [saving, setSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchValue = async () => {
      try {
        const response = await axios.get(`${API}/cms/${page}`);
        const cmsValue = response.data?.sections?.[section]?.[field];
        if (cmsValue) {
          setSrc(cmsValue);
          setTempSrc(cmsValue);
        }
      } catch (error) {
        // Use default value
      }
    };
    fetchValue();
  }, [page, section, field]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const existingResponse = await axios.get(`${API}/cms/${page}`);
      const existingSection = existingResponse.data?.sections?.[section] || {};
      
      await axios.put(
        `${API}/admin/cms`,
        {
          page,
          section,
          content: { ...existingSection, [field]: tempSrc }
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      setSrc(tempSrc);
      setIsEditing(false);
      toast.success('Image updated!');
    } catch (error) {
      toast.error('Failed to update image');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return <img src={src || defaultSrc} alt={alt} className={className} />;
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={src || defaultSrc} alt={alt} className={className} />
      
      <AnimatePresence>
        {isHovered && !isEditing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-2 right-2 w-10 h-10 bg-[#f16a2f] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#d65a25] transition-colors z-10"
            onClick={() => setIsEditing(true)}
            title="Change image"
          >
            <Pencil className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 rounded-xl"
          >
            <p className="text-white text-sm mb-2">Enter image URL:</p>
            <Input
              value={tempSrc}
              onChange={(e) => setTempSrc(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mb-3 bg-white"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="bg-white">
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * AdminEditBanner
 * Shows a banner at the top when admin is logged in
 */
export const AdminEditBanner = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) return null;
  
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#f16a2f] text-white px-6 py-2 rounded-full shadow-lg flex items-center gap-2"
    >
      <Pencil className="w-4 h-4" />
      <span className="text-sm font-medium">Admin Mode: Hover over content to edit</span>
    </motion.div>
  );
};

export default EditableText;
