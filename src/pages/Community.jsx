import styles, { layout } from '../style';
import {CommunitySection2, HeroCommunity, CommunityBlogSection} from "../components";
import Footer from '../components/Footer';


const Community = () => (
<section>
  <HeroCommunity />
   <CommunitySection2 />
   <CommunityBlogSection />
    <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                  <Footer />
                  </div>
    </section>
  )


export default Community