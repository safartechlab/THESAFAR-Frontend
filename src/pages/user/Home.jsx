import Bannerslider from "../user/Bannderslider";
import Homeproduct from "./Homeproduct";
import Categorysilder from "./Homeslider";
import ServiceFeatures from "./Services";

const Home = () => {
  return (
    <div>
      <Bannerslider />
      <Categorysilder/>
      <Homeproduct/>
      <ServiceFeatures/>
    </div>
  );
};

export default Home;
 