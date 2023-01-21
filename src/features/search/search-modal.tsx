import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactPortal from "../reactPortal/reactPortal";
import SearchDropdown from "./search-dropdown";
import "./search-modal.css";

import { ReactComponent as CloseIcon } from "../../assets/cross@24px.svg";
import { ReactComponent as MiaLogo } from "../../assets/mia-logo@24px.svg";

enum SearchModalState {
  Hidden,
  Visible,
}

const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [searchModalState, setSearchModalState] = useState<SearchModalState>(
    SearchModalState.Visible
  );
  const location = useLocation();
  const [firstLocation, setFirstLocation] = useState<string>("/");

  useEffect(() => {
    if (isOpen) {
      setFirstLocation(location.pathname);
    }
  }, [isOpen]);

  useEffect(() => {
    if (firstLocation !== location.pathname) {
      onClose();
    }
  }, [location]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (searchModalState === SearchModalState.Hidden) {
      timeout = setTimeout(() => {
        setSearchModalState(SearchModalState.Visible);
        onClose();
      }, 200);
    }

    return () => clearTimeout(timeout);
  }, [searchModalState]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ReactPortal wrapperId="portal">
      <div
        className={`searchmodal ${
          searchModalState === SearchModalState.Visible
            ? "searchmodal-enter"
            : "searchmodal-exit"
        }`}
      >
        <div
          className={`searchmodal-content ${
            searchModalState === SearchModalState.Visible
              ? "searchmodal-content-enter"
              : "searchmodal-content-exit"
          }`}
        >
          <div className="searchmodal-header">
            <button className="searchmodal-header-closebtn" onClick={onClose}>
              <CloseIcon fill="#343538" />
            </button>
            <MiaLogo className="searchmodal-header-mialogo" />
          </div>

          <div className="searchmodal-search-content">
            <SearchDropdown />
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};

export default SearchModal;
