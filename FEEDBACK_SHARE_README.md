# FeedbackFormWithShare Component

A production-ready React component that extends the Feedback Form with floating social media icons (Instagram, Facebook, Share).

## Features

- ✅ Three floating social icons below feedback card
- ✅ Web Share API with fallback modal
- ✅ QR code generation for sharing
- ✅ Copy to clipboard functionality
- ✅ WhatsApp and Facebook share options
- ✅ Configuration-driven (Village Configuration JSON)
- ✅ Fully accessible (ARIA labels, keyboard navigation)
- ✅ i18n ready with translation wrapper
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations

## Installation

No additional dependencies required! Uses existing project dependencies:
- React
- Tailwind CSS
- Lucide React icons
- react-i18next

## Configuration

### Village Configuration JSON

Add the following to your village configuration:

```json
{
  "social": {
    "instagram": "https://instagram.com/yourvillage",
    "facebook": "https://facebook.com/yourvillage",
    "shareUrl": "https://yourvillage.com",
    "enabled": {
      "instagram": true,
      "facebook": true,
      "share": true
    }
  },
  "villageName": "Your Village Name"
}
```

### Configuration Keys

| Key | Type | Description |
|-----|------|-------------|
| `social.instagram` | string | Instagram profile URL |
| `social.facebook` | string | Facebook page URL |
| `social.shareUrl` | string | URL to share (defaults to current page) |
| `social.enabled.instagram` | boolean | Show/hide Instagram icon |
| `social.enabled.facebook` | boolean | Show/hide Facebook icon |
| `social.enabled.share` | boolean | Show/hide Share icon |
| `villageName` | string | Used as share title |

## Usage

### Basic Usage (Uses VillageContext)

```tsx
import FeedbackFormWithShare from '@/components/FeedbackFormWithShare';

function App() {
  return <FeedbackFormWithShare />;
}
```

### With Custom Config

```tsx
import FeedbackFormWithShare from '@/components/FeedbackFormWithShare';

const socialConfig = {
  instagram: "https://instagram.com/myvillage",
  facebook: "https://facebook.com/myvillage",
  shareUrl: "https://myvillage.com",
  enabled: {
    instagram: true,
    facebook: true,
    share: true
  }
};

function App() {
  return (
    <FeedbackFormWithShare 
      socialConfig={socialConfig}
      pageTitle="My Village Website"
      onShare={(info) => console.log('Shared via:', info.method)}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `socialConfig` | SocialConfig | No | Override village config social settings |
| `pageTitle` | string | No | Title for share dialog |
| `onShare` | function | No | Callback when share action occurs |

## Share Flow

1. **Web Share API** (primary): Uses native device share if available
2. **Fallback Modal**: Shows when Web Share API unavailable
   - Copy Link button
   - WhatsApp share
   - Facebook share
   - QR Code

## Accessibility

- All icons have `aria-label` attributes
- Keyboard accessible (Enter/Space triggers)
- Focus indicators visible
- Screen reader friendly

## Styling

Icons use dynamic colors based on footer visibility:
- Default: `#0F5C3D` (dark green)
- Footer visible: `#32D26C` (light green)

Icon specifications:
- Size: 44x44px (minimum touch target)
- Background: Green (#0F5C3D)
- Icon color: White
- Hover: Scale up 1.1x
- Animation: Fade in with upward motion

## Testing

### Desktop
1. Click feedback button
2. Verify floating icons appear below card
3. Test each icon:
   - Instagram: Opens in new tab
   - Facebook: Opens in new tab
   - Share: Shows native share or fallback modal

### Mobile
1. Click feedback button
2. Verify icons are properly sized (44px minimum)
3. Test native share API on supported browsers
4. Verify fallback modal on unsupported browsers

### PWA
1. Test in installed PWA mode
2. Verify share functionality works
3. Test QR code generation

## Browser Support

- Chrome 61+ (Web Share API)
- Safari 12.1+ (Web Share API)
- Firefox (fallback modal)
- Edge 79+ (Web Share API)

## Translations

All strings use `t()` wrapper for i18n. Add these keys to your translation files:

```json
{
  "openInstagram": "Open Instagram",
  "openFacebook": "Open Facebook",
  "shareProfile": "Share this profile",
  "share": "Share",
  "copyLink": "Copy Link",
  "shareWhatsApp": "Share via WhatsApp",
  "shareFacebook": "Share on Facebook",
  "scanQR": "Scan QR Code",
  "linkCopied": "Link copied!",
  "linkCopiedDesc": "The link has been copied to your clipboard.",
  "pageNotAvailable": "Page not available",
  "linkNotConfigured": "This link is not configured yet.",
  "checkOutVillage": "Check out our village website!"
}
```

## Icon Assets

Icons are rendered using Lucide React. For custom assets:

### SVG (Recommended)
Use Lucide icons directly:
- `Instagram` from 'lucide-react'
- `Facebook` from 'lucide-react'
- `Share2` from 'lucide-react'

### Custom PNG Assets
If needed, generate at these sizes:
- 32x32px (1x)
- 48x48px (1.5x)
- 64x64px (2x)
- 96x96px (3x)

Color specifications:
- Background: #0F5C3D
- Icon: #FFFFFF (white)
