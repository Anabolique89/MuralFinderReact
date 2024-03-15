import styles, { layout } from '../style';
import { libraWhite } from '../assets';
import { Business, CardDeal, CTA, Footer, CommunitySection2, HeroCommunity, CommunityBlogSection} from "../components";


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