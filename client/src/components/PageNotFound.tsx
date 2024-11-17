import React from "react";
import notfound from "./img/404.svg";
import "./style/NotFound.css";

const PageNotFound: React.FC = () => {
    return (
        <>
            <div className="cont-404">
                <img className="img-404" src={notfound} alt="svg" />
                <button className="but-404">Back to Home</button>
            </div>
        </>
    );
};

export default PageNotFound;