import React from "react";
import notfound from "./img/404.svg";

const PageNotFound: React.FC = () => {
    return (
        <>
            <div className="cont-404">
                <img src={notfound} alt="svg" />
                <button>Back to Home</button>
            </div>
        </>
    );
};

export default PageNotFound;