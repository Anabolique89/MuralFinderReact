import { Fragment, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import { AdobeStock_259925422, ArtZoroLogoWhite, bannerShop, pinkwallpaper, creative, cute, jhgfd, jjnjkbj, OceanOfBlue, passion, swimBlue, wallpaper2, mural, muralcopy, prints, prints2, Img1, mural2, streetartManual, MeshBackground } from '../../assets';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../../style';
import { ModernRoute } from '../../components';
import WallpaperRow from '../../components/ShopCategories/WallpapersRow';
import { BooksRow } from '../../components/ShopCategories';
import ArtSuppliesRow from '../../components/ShopCategories/ArtSuppliesRow';

const navigation = {
  categories: [
    {
      name: 'New',
      featured: [
        {
          name: 'Services',
          href: '#',
          imageSrc: Img1,
          imageAlt: 'New types of art supplies coming soon...',
        },
        {
          name: 'Murals',
          href: '#',
          imageSrc: mural,
          imageAlt: 'Section of painted jungle themed indoor mural',
        },
        {
          name: 'Artwork',
          href: '#',
          imageSrc: prints,
          imageAlt: 'custom neon artwork love',
        },
        {
          name: 'Poster Prints',
          href: '/PosterPrints',
          imageSrc: prints2,
          imageAlt: 'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
      ],
    },
    {
      name: 'Sale',
      featured: [
        {
          name: 'New Arrivals',
          href: '/Shop',
          imageSrc: jhgfd,
          imageAlt: 'new arrivals',
        },
        {
          name: 'Wallpaper',
          href: '/Wallpapers',
          imageSrc: mural2,
          imageAlt: 'Wallpaper oriental',
        },
        {
          name: 'Books',
          href: '/Books',
          imageSrc: streetartManual,
          imageAlt:'the street art manual book',
        },
        {
          name: 'Materials',
          href: '/Materials',
          imageSrc: cute,
          imageAlt: 'raw materials inspiration info',
        },
      ],
    },
  ],
  pages: [
    { name: 'Shop', href: '/Shop' },
    { name: 'Home', href: '/' },
  ],
}
const categories = [
  {
    name: 'ArtSupplies',
    href: '/ArtSupplies',
    imageSrc: pinkwallpaper,
  },
  {
    name: 'Materials',
    href: '/Materials',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-02.jpg',
  },
  {
    name: 'Wallpaper',
    href: '/Wallpapers',
    imageSrc: wallpaper2,
  },
  {
    name: 'WallMurals',
    href: '#',
    imageSrc: jhgfd,
  },
  {
    name: 'PosterPrints',
    href: '/PosterPrints',
    imageSrc: jjnjkbj,
  },
  { name: 'Books', 
    href: '/Books', 
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-category-03.jpg' },
]
// const collections = [
//   {
//     name: 'Handcrafted Collection',
//     href: '#',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-collection-01.jpg',
//     imageAlt: 'Brown leather key ring with brass metal loops and rivets on wood table.',
//     description: 'Keep your phone, keys, and wallet together, so you can lose everything at once.',
//   },
//   {
//     name: 'Organized Desk Collection',
//     href: '#',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-collection-02.jpg',
//     imageAlt: 'Natural leather mouse pad on white desk next to porcelain mug and keyboard.',
//     description: 'The rest of the house will still be a mess, but your desk will look great.',
//   },
//   {
//     name: 'Focus Collection',
//     href: '#',
//     imageSrc: 'https://tailwindui.com/img/ecommerce-images/home-page-01-collection-03.jpg',
//     imageAlt: 'Person placing task list card into walnut card holder next to felt carrying case on leather desk pad.',
//     description: 'Be more productive than enterprise project managers with a single piece of paper.',
//   },
// ]

export default function Shop() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <ModernRoute title="Shop" showHeader={false}>
      <div className="bg-indigo-600 min-h-screen pt-20">
        {/* Shop Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Shop Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-raleway font-bold text-white mb-4">
              Art Shop
            </h1>
            <p className="text-lg font-raleway text-dimWhite">
              Discover amazing art supplies, wallpapers, and books
            </p>
          </div>

          {/* Shop Categories */}
          <ArtSuppliesRow />
          <WallpaperRow />
          <BooksRow />
        </div>
      </div>
    </ModernRoute>
  )
}
