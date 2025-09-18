import React from 'react';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import BookIcon from '@mui/icons-material/Book';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import BookOpenIcon from '@mui/icons-material/MenuBook';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import SchoolIcon from '@mui/icons-material/School';

export const iconMap: Record<string, React.ComponentType> = {
  // Exercise types
  'multiple-choice': FormatListNumberedIcon,
  'sentence-correction': EditIcon,
  'fill-in-the-blank': KeyboardIcon,
  'true-false': CheckCircleOutlineIcon,
  
  // Lesson content types
  'vocabulary': SchoolIcon,
  'book': BookIcon,
  'message': MessageIcon,
  'volume': VolumeUpIcon,
  'edit': EditIcon,
  'star': StarIcon,
  'book-open': BookOpenIcon,
  'headphones': HeadphonesIcon,
};

export const getIconForType = (type: string): React.ReactElement => {
  const IconComponent = iconMap[type] || DescriptionIcon;
  return <IconComponent />;
};
