import React from 'react';
import {
  Card,
  Typography,
  Box,
  Zoom,
} from '@mui/material';
import { FeatureCategory } from '../../config/contentConfiguration';

interface FeatureCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  category: FeatureCategory;
  index: number;
}

/**
 * Reusable feature card component with CSS-first architecture
 * Uses data attributes for styling and design tokens for consistency
 * Eliminates JavaScript color calculations and MUI theme usage
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  category,
  index,
}) => {
  return (
    <Zoom in timeout={600 + index * 100}>
      <Card
        className="card-variant-feature feature-card"
        data-category={category}
        sx={{
          height: '100%',
          p: 3,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Box
          className="feature-header"
          data-category={category}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 'var(--border-radius-medium)',
            mb: 3,
            fontSize: 40,
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'var(--font-weight-bold)',
            mb: 2,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Card>
    </Zoom>
  );
};

export default FeatureCard;
