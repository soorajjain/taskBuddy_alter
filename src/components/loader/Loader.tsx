import React from "react";
import { BeatLoader } from "react-spinners";

function Loader() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <BeatLoader
        visible={true}
        height="50"
        width="50"
        color="#075cab"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;
