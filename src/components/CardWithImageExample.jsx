import React from 'react';
import styles from '../style';
import Button2 from './Button2';
import {  swimWhite, fadeintoyouWhite, steampunk} from '../assets';

const CardWithImageExample  = () => (
<section className='flex flex-wrap  justify-center w-full feedback-container relative z-[1]'>
      <div
        className=" flex flex-col justify-between max-w-[320px] md:m-2 sm:max-w-[350px] xs:max-w-[400px] feedback-card m-2 backdrop-filter backdrop-blur-lg md:p-4 sm:p-6 ss:p-8 p-2 rounded-2xl border-solid border-2 border-indigo-600 ">
        <a href="/IndexSignup">
          <img
            className="rounded-t-lg"
            src={steampunk}
            alt="" />
        </a>
        <div className="p-2">
          <h5
            className="mb-2 font-raleway text-[28px] leading-[32px] font-bold text-white">
           Create Your Profile
          </h5>
          <p className={styles.paragraph}>
            Use our services to expand your online presence and connect to other artists & artlovers.
          </p>
      
          <div className='pt-4'>
    <Button2 />
    </div>
        </div>
      </div>

<div
className="flex flex-col justify-between max-w-[320px] md:m-2 sm:max-w-[350px] xs:max-w-[400px] feedback-card m-2 backdrop-filter backdrop-blur-lg md:p-4 sm:p-6 ss:p-8 p-2 rounded-2xl border-solid border-2 border-indigo-600 ">
<a href="/Community">
  <img
    className="rounded-t-lg"
    src={fadeintoyouWhite}
    alt="" />
</a>
<div className="p-2 pt-6">
  <h5
    className="mb-2 font-raleway text-[28px] leading-[32px] font-bold text-white">
    Build a community
  </h5>
  <p className={styles.paragraph}>
    Share your artistic vision on our Community page by posting articles and keep updated on various subjects.
  </p>

  <div className='pt-4'>
    <Button2 />
    </div>
</div>
</div>

<div
className="flex flex-col justify-between max-w-[320px] md:m-2 sm:max-w-[350px] xs:max-w-[400px] feedback-card m-2 backdrop-filter backdrop-blur-lg md:p-4 sm:p-6 ss:p-8 p-2 rounded-2xl border-solid border-2 border-indigo-600 ">
<a href="/Community">
  <img
    className="rounded-t-lg"
    src={swimWhite}
    alt="" />
</a>
<div className="p-2">
  <h5
    className="mb-2 font-raleway text-[28px] leading-[32px] font-bold leading-tight text-white ">
   And get discovered
  </h5>
  <p className={styles.paragraph}>
   Find potential clients and showcase your work as an artist!
  </p>
<div className='pt-4'>
    <Button2 />
    </div>
</div>
</div>
</section>
  );

  export default CardWithImageExample