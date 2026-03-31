import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PageLoader = () => {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0f0f0f" // optional
    }}>
      <DotLottieReact
        src="https://lottie.host/7c339ce1-d933-48c0-8bea-95aefa289a6b/vP0J7y1PPD.lottie"
        loop
        autoplay
        style={{ width: "200px" }}
      />
    </div>
  );
};

export default PageLoader;