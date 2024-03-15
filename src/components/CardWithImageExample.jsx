import React from 'react';
import styles from '../style';
import Button2 from './Button2';
import {  swimWhite, fadeintoyouWhite, steampunk} from '../assets';

const CardWithImageExample  = () => (
<section className='flex flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1]'>
      <div
        className=" flex flex-col justify-between max-w-[320px] md:m-10 sm:m-5 feedback-card m-3 backdrop-filter backdrop-blur-lg md:p-6 sm:p-8 ss:p-20 rounded-2xl border-solid border-2 border-indigo-600 ">
        <a href="#!">
          <img
            className="rounded-t-lg"
            src={steampunk}
            alt="" />
        </a>
        <div className="p-6">
          <h5
            className="mb-2 font-raleway text-[28px] leading-[32px] font-bold leading-tight text-white">
           Create Your Profile
          </h5>
          <p className={styles.paragraph}>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
      
          <div className='pt-4'>
    <Button2 />
    </div>
        </div>
      </div>

<div
className="flex flex-col justify-between max-w-[320px] md:m-10 sm:m-5 feedback-card m-3 backdrop-filter backdrop-blur-lg md:p-6 sm:p-8 ss:p-20 rounded-2xl border-solid border-2 border-indigo-600 ">
<a href="#!">
  <img
    className="rounded-t-lg"
    src={fadeintoyouWhite}
    alt="" />
</a>
<div className="p-6">
  <h5
    className="mb-2 font-raleway text-[28px] leading-[32px] font-bold leading-tight text-white">
    Build a community
  </h5>
  <p className={styles.paragraph}>
    Some quick example text to build on the card title and make up the
    bulk of the card's content.
  </p>

  <div className='pt-4'>
    <Button2 />
    </div>
</div>
</div>

<div
className="flex flex-col justify-between max-w-[320px] md:m-10 sm:m-5 feedback-card m-3 backdrop-filter backdrop-blur-lg md:p-6 sm:p-8 ss:p-20 rounded-2xl border-solid border-2 border-indigo-600 ">
<a href="#!">
  <img
    className="rounded-t-lg"
    src={swimWhite}
    alt="" />
</a>
<div className="p-6">
  <h5
    className="mb-2 font-raleway text-[28px] leading-[32px] font-bold leading-tight text-white ">
   And get discovered
  </h5>
  <p className={styles.paragraph}>
    Some quick example text to build on the card title and make up the
    bulk of the card's content.
  </p>
<div className='pt-4'>
    <Button2 />
    </div>
</div>
</div>
</section>
  );

  export default CardWithImageExample