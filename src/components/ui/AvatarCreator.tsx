import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Smile, Bot, User, Heart, Star, Sun, Moon, Zap, Shield, Rocket, Flag, Bell, Gift, Home } from 'lucide-react';
import Button from './Button';

interface AvatarCreatorProps {
  onAvatarChange: (avatar: string) => void;
  onClose: () => void;
  currentAvatar?: string;
}

const icons: FC<any>[] = [Smile, Bot, User, Heart, Star, Sun, Moon, Zap, Shield, Rocket, Flag, Bell, Gift, Home];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#9B5DE5', '#F15BB5', '#00F5D4', '#FFA69E', '#AED9E0', '#B8F2E6', '#FAF3DD', '#CDB4DB'];

const AvatarCreator: FC<AvatarCreatorProps> = ({ onAvatarChange, onClose }) => {
  const { t } = useTranslation();
  const [selectedIcon, setSelectedIcon] = useState<FC<any>>(() => icons[0]);
  const [iconColor, setIconColor] = useState(colors[0]);
  const [backgroundColor, setBackgroundColor] = useState(colors[1]);

  const IconComponent = selectedIcon;

  const generateAvatarSvg = (bgColor: string, Icon: FC<any>, iColor: string): string => {
    const iconSize = 60;
    const svgSize = 100;
    const iconOffset = (svgSize - iconSize) / 2;

    // This is a simplified and fragile way to get the SVG content from lucide-react icons.
    // It makes assumptions about the internal structure of the icons.
    // A more robust solution would involve a library or a different approach if this breaks.
    const IconElement = Icon({ size: iconSize, color: iColor });
    const getSvgPath = (element: any): string => {
      if (!element || !element.props || !element.props.children) return '';
      return element.props.children.map((child: any) => {
        if (typeof child === 'string') return '';
        const { type, props } = child;
        const propString = Object.entries(props)
          .filter(([key]) => key !== 'children' && props[key] !== undefined)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}="${value}"`)
          .join(' ');
        return `<${type} ${propString}></${type}>`;
      }).join('');
    };
    
    const innerSvg = getSvgPath(IconElement);

    const svgString = `
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${svgSize}" height="${svgSize}" fill="${bgColor}" />
        <g 
          transform="translate(${iconOffset}, ${iconOffset})" 
          stroke="${iColor}" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          fill="none"
        >
          ${innerSvg}
        </g>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
  };

  const handleSave = () => {
    const avatarDataUrl = generateAvatarSvg(backgroundColor, selectedIcon, iconColor);
    onAvatarChange(avatarDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{t('agents.avatarCreator.title')}</h2>
        
        <div className="flex justify-center mb-6">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-inner"
            style={{ backgroundColor }}
          >
            <IconComponent size={64} color={iconColor} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('agents.avatarCreator.icon')}</label>
            <div className="flex flex-wrap gap-2">
              {icons.map((Icon, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIcon(() => Icon)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-110 ${selectedIcon === Icon ? 'ring-2 ring-green-500' : 'ring-1 ring-gray-300'}`}
                >
                  <Icon size={24} className="text-gray-700" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('agents.avatarCreator.iconColor')}</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setIconColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 border-2 ${iconColor === color ? 'ring-2 ring-offset-2 ring-green-500 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  aria-label={t('agents.avatarCreator.ariaIconColor', { color })}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('agents.avatarCreator.backgroundColor')}</label>
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 border-2 ${backgroundColor === color ? 'ring-2 ring-offset-2 ring-green-500 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  aria-label={t('agents.avatarCreator.ariaBackgroundColor', { color })}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={onClose} variant="outline">{t('common.cancel')}</Button>
          <Button onClick={handleSave}>{t('agents.avatarCreator.save')}</Button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;
