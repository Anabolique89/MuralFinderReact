import { useState } from 'react';
import styles from "../../style";
import { Footer, BackToTopButton } from '../../components';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
// import { StarIcon } from '@heroicons/react/20/solid'
// import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

const product = {
  name: 'MEEDEN Deluxe Crank Adjusting Master Artist Easel - Mahogany',
  price: '£469.99',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MEEDEN-Deluxe-Crank-Adjusting-Master-Artist-Easel-Stand-Dark-Walnut-W15S-MEEDEN-1692307411234_1600x1600_c566c2b0-044f-41f3-b3c4-038bb56c052c_1200x.jpg?v=1696322251',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 2,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MEEDEN-Deluxe-Crank-Adjusting-Master-Artist-Easel-Stand-Dark-Walnut-W15S-MEEDEN-1692307415750_1500x1500_783f13ab-bb12-477b-9e75-98bf2de8291a_5000x.jpg?v=1696322251',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 3,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MEEDEN-Deluxe-Crank-Adjusting-Master-Artist-Easel-Stand-Dark-Walnut-W15S-MEEDEN-1692307426980_990x990_7aafd201-0fcb-401c-af7f-efdc223e3ed6_5000x.jpg?v=1696322251',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 4,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MEEDEN-Deluxe-Crank-Adjusting-Master-Artist-Easel-Stand-Dark-Walnut-W15S-MEEDEN-1692307422266_990x990_0103bb0b-a140-4f44-822c-791b0d393b87_1200x.jpg?v=1696322251',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    // More images...
  ],
 
  description: `
    <p>MAGNIFICENT Deluxe Crank Adjusting Wooden Easel is a high-quality, versatile easel designed for professional or experienced artists.
The easel is finely handcrafted with European seasoned Beechwood and has a polished Mahogany finish, giving it a stunning rich colour. This elegant appearance adds aesthetic value to any studio.
</p>
  `,
  // details: [
  //   {
  //     name: 'Features',
  //     items: [
  //       'Multiple strap configurations',
  //       'Spacious interior with top zip',
  //       'Leather handle and tabs',
  //       'Interior dividers',
  //       'Stainless strap loops',
  //       'Double stitched construction',
  //       'Water-resistant',
  //     ],
  //   },
  //   // More sections...
  // ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Product1Easel() {
  // const [selectedColor, setSelectedColor] = useState(product.colors[0])

  return (
    <div className="bg-indigo-600">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {product.images.map((image) => (
                  <Tab
                    key={image.id}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium font-raleway uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    <span className="sr-only">{image.name}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img alt="" src={image.src} className="h-full w-full object-cover object-center" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-400"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>
            <a href="https://click.linksynergy.com/link?id=JQtDC3CcG3s&offerid=674330.4382140550534938706&type=2&murl=https%3a%2f%2fartdiscount.co.uk%2fproducts%2fdeluxe-crank-adjusting-master-artist-easel%3fvariant%3d40550534938706">
            <TabPanels className="aspect-h-1 aspect-w-1 w-full">
              {product.images.map((image) => (
                <TabPanel key={image.id}>
                  <img
                    alt={image.alt}
                    src={image.src}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </TabPanel>
              ))}
            </TabPanels>
            </a>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className={`text-3xl font-raleway font-bold tracking-tight text-gray-900 ${styles.heading2}`}>{product.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-white font-raleway">{product.price}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
              
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className={`space-y-6 text-base font-raleway ${styles.paragraph}`}
              />
            </div>

            <form className="mt-6">

              <div className="mt-10 flex">
              <a href="https://click.linksynergy.com/link?id=JQtDC3CcG3s&offerid=674330.4382140550534938706&type=2&murl=https%3a%2f%2fartdiscount.co.uk%2fproducts%2fdeluxe-crank-adjusting-master-artist-easel%3fvariant%3d40550534938706">
                <button
                  type="button"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-800 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                View Offer
                </button>
</a>
{/* <a href="https://click.linksynergy.com/link?id=JQtDC3CcG3s&offerid=674330.4382142353359689&type=2&murl=https%3a%2f%2fartdiscount.co.uk%2fproducts%2fmabef-m-05-studio-easel%3fvariant%3d42353359689">Mabef M05 Studio Easel</a> */}
              </div>
            </form>

            {/* <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                {product.details.map((detail) => (
                  <Disclosure key={detail.name} as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                          {detail.name}
                        </span>
                        <span className="ml-6 flex items-center"> */}
                          {/* <PlusIcon
                            aria-hidden="true"
                            className="block h-6 w-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                          /> */}
                          {/* <MinusIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                          /> */}
                        {/* </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="prose prose-sm pb-6">
                      <ul role="list">
                        {detail.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>
            </section> */}
          </div>
        </div>
      </div>
      <BackToTopButton />
      <div className={`${styles.paddingX} bg-indigo-600 w-full overflow-hidden`}>
                  <Footer />
                  </div>
    </div>
  )
}
