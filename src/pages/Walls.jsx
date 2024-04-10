import React from 'react'
import styles, { layout } from '../style';
import { WallsHero, WallsIntro, Footer } from '../components';


const Walls = () => (
 
  <section className='bg-indigo-700 w-full overflow-hidden'>
    <WallsIntro />
    <WallsHero />
    <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                  <Footer />
                  </div>
  </section>
)

export default Walls