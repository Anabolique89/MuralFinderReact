import React, { useEffect } from "react";
import { Footer,BottomNavigation } from '../components';
import styles from '../style';


export default function TermsConditions() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);  return (
    <section>
    <div className="p-5"
      name="termly-embed"
      data-id="7fa83a6a-b2f0-4cfb-94aa-d7df216c3b19"
      data-type="iframe"
      
    ></div>
     <div className={`${styles.paddingX} bg-indigo-700 w-full overflow-hidden`}>
                <Footer />
                <BottomNavigation />
            </div>
    </section>
  );
}

