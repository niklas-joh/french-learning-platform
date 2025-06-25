import React from 'react';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';

export const iconMap: Record<string, React.ComponentType> = {
  'multiple-choice': FormatListNumberedIcon,
  'sentence-correction': EditIcon,
  'fill-in-the-blank': KeyboardIcon,
  'true-false': CheckCircleOutlineIcon,
};

export const getIconForType = (type: string): React.ReactElement => {
  const IconComponent = iconMap[type] || DescriptionIcon;
  return <IconComponent />;
};
