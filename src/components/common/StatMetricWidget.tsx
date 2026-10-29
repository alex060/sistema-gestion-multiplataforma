/**
 * Componente: StatMetricWidget
 * Fase 2 - Paso 2.1 y 2.2: Componentización Visual y Gestión de Estado/Eventos (RA 3)
 * Componente agnóstico, independiente e instanciable que recibe Props y emite Callbacks.
 */

import React, { useMemo } from 'react';
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonProgressBar
} from '@ionic/react';
import { trendingUpOutline, trendingDownOutline, arrowForwardOutline } from 'ionicons/icons';

export interface TrendInfo {
  value: number;
  isPositive: boolean;
  text?: string;
}

export interface StatMetricWidgetProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  colorTheme?: 'primary' | 'success' | 'warning' | 'danger' | 'tertiary';
  trend?: TrendInfo;
  progress?: number; // 0 a 100
  badgeText?: string;
  interactive?: boolean;
  onWidgetClick?: (widgetTitle: string) => void;
  onActionClick?: (widgetTitle: string) => void;
}

export const StatMetricWidget: React.FC<StatMetricWidgetProps> = React.memo(({
  title,
  value,
  subtitle,
  icon,
  colorTheme = 'primary',
  trend,
  progress,
  badgeText,
  interactive = false,
  onWidgetClick,
  onActionClick
}) => {
  // Paleta de colores temáticos accesibles con alto contraste (WCAG AA)
  const themeStyles = useMemo(() => {
    switch (colorTheme) {
      case 'success':
        return {
          bgIcon: '#dcfce7',
          colorIcon: '#15803d',
          borderLeft: '4px solid #16a34a'
        };
      case 'warning':
        return {
          bgIcon: '#fef3c7',
          colorIcon: '#b45309',
          borderLeft: '4px solid #d97706'
        };
      case 'danger':
        return {
          bgIcon: '#fee2e2',
          colorIcon: '#b91c1c',
          borderLeft: '4px solid #dc2626'
        };
      case 'tertiary':
        return {
          bgIcon: '#f3e8ff',
          colorIcon: '#7e22ce',
          borderLeft: '4px solid #9333ea'
        };
      case 'primary':
      default:
        return {
          bgIcon: '#dbeafe',
          colorIcon: '#1d4ed8',
          borderLeft: '4px solid #2563eb'
        };
    }
  }, [colorTheme]);

  const handleClick = () => {
    if (interactive && onWidgetClick) {
      onWidgetClick(title);
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(title);
    }
  };

  return (
    <IonCard
      style={{
        margin: 0,
        height: '100%',
        borderLeft: themeStyles.borderLeft,
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
      onClick={handleClick}
      role={interactive ? 'button' : 'region'}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`Métrica: ${title}. Valor: ${value}`}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <IonCardContent style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                color: '#64748b',
                display: 'block',
                marginBottom: '0.25rem'
              }}
            >
              {title}
            </span>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.1
              }}
            >
              {value}
            </div>
          </div>

          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: themeStyles.bgIcon,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            aria-hidden="true"
          >
            <IonIcon icon={icon} style={{ fontSize: '24px', color: themeStyles.colorIcon }} />
          </div>
        </div>

        {/* Indicador de Tendencia / Variación porcentual */}
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontWeight: 700,
                color: trend.isPositive ? '#15803d' : '#b91c1c',
                backgroundColor: trend.isPositive ? '#dcfce7' : '#fee2e2',
                padding: '0.15rem 0.4rem',
                borderRadius: '6px'
              }}
            >
              <IonIcon icon={trend.isPositive ? trendingUpOutline : trendingDownOutline} />
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span style={{ color: '#64748b' }}>
              {trend.text || 'vs. período anterior'}
            </span>
          </div>
        )}

        {/* Barra de progreso opcional */}
        {typeof progress === 'number' && (
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
              <span>Progreso de objetivo</span>
              <span style={{ fontWeight: 600 }}>{progress}%</span>
            </div>
            <IonProgressBar value={progress / 100} color={colorTheme} style={{ borderRadius: '4px', height: '6px' }} />
          </div>
        )}

        {/* Subtítulo o badge adicional */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
          {subtitle && (
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {subtitle}
            </span>
          )}
          {badgeText && (
            <IonBadge color={colorTheme} style={{ fontSize: '0.7rem' }}>
              {badgeText}
            </IonBadge>
          )}
          {interactive && (
            <span
              onClick={handleAction}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: themeStyles.colorIcon,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Detalles
              <IonIcon icon={arrowForwardOutline} />
            </span>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
});

StatMetricWidget.displayName = 'StatMetricWidget';
export default StatMetricWidget;
