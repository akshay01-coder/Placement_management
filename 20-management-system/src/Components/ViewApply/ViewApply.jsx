import React from "react";
import { MoveLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ViewApplyCards from "./ViewApplyCards";

const ViewApply = () => {

  const location = useLocation();

  const company = location.state?.company;

  return (
    <div className="min-h-screen pb-20">

      <div className="text-gray-400 flex w-fit mt-9 ml-80">

        <Link to="/upcoming">
          <button className="flex items-center justify-center gap-2 hover:bg-purple-500/10 rounded-2xl w-47 h-10 active:scale-95">

            <MoveLeft size={20} />

            <span>Back to Companies</span>

          </button>
        </Link>

      </div>

      <ViewApplyCards company={company} />

    </div>
  );
};

export default ViewApply;