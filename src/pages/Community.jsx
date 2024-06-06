import styles, { layout } from '../style';
import { BottomNavigation, Footer, CommunitySection2, HeroCommunity, CommunityBlogSection} from "../components";


const Community = () => (
<section>
  <HeroCommunity />
   <CommunitySection2 />
   <CommunityBlogSection />
    <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                  <Footer />
                 
                  </div>
                  <BottomNavigation />
    </section>
  )


export default Community