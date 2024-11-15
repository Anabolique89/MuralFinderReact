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
  name: 'Mabef M02 Heavyweight Studio Easel',
  price: '£952.00',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: 'https://cdn.shopify.com/s/files/1/1751/8993/files/Mabef_M02_Heavyweight_Studio_Easel_1.jpg?v=1697730787',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 2,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MO2_5_5000x.jpg?v=1701862384',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 3,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MO2_1_5000x.jpg?v=1701862384',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    {
      id: 4,
      name: 'Angled view',
      src: 'https://artdiscount.co.uk/cdn/shop/files/MO2_3_5000x.jpg?v=1701862384',
      alt: 'Angled front view with bag zipped and handles upright.',
    },
    // More images...
  ],
 
  description: `
    <p>The Mabef Heavyweight Studio Easel M/02 is a sturdy studio easel with a Lifetime Guarantee that will take canvases up to 92". 
    PLEASE NOTE THE FOLLOWING IMPORTANT INFORMATION: 
    This easel is sent directly from the manufacturer. Please allow 5-7 business days for your order to be delivered. 
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

export default function Product3Easel() {
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
            <a href="https://click.linksynergy.com/link?id=JQtDC3CcG3s&offerid=674330.4382142353359689&type=2&murl=https%3a%2f%2fartdiscount.co.uk%2fproducts%2fmabef-m-05-studio-easel%3fvariant%3d42353359689">
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
                
              <a href="https://click.linksynergy.com/link?id=JQtDC3CcG3s&offerid=674330.4382142358001161&type=2&murl=https%3a%2f%2fartdiscount.co.uk%2fproducts%2fmabef-heavyweight-studio-easel-m-02%3fvariant%3d42358001161">
                <button
                  type="button"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-800 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                View Offer
                </button>
</a>
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
