import React, { useEffect, useRef, useState } from "react";
import { Item } from "../../models/item";
import { searchItems } from "../../app/services/gastromiaApi";
import "./searchDropdown.css";

import { ReactComponent as SearchIcon } from "../../assets/search@20px.svg";
import { ReactComponent as EmptyIcon } from "../../assets/empty-search@120px.svg";
import SearchItem from "./searchItem";

const categories = [
  {
    name: "Poké",
    pictureUrl: "https://dzfokbljn6tmk.cloudfront.net/category-logos/poke.png",
  },
  {
    name: "Mexican",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/mexican.png",
  },
  {
    name: "Street Food",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/streetfood.png",
  },
  {
    name: "Veggie",
    pictureUrl: "https://dzfokbljn6tmk.cloudfront.net/category-logos/vegan.png",
  },
  {
    name: "Pizza",
    pictureUrl: "https://dzfokbljn6tmk.cloudfront.net/category-logos/pizza.png",
  },
  {
    name: "Sandwich",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/sandwich.png",
  },
  {
    name: "Drinks",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/drinks.png",
  },
  {
    name: "Specialty",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/specialty.png",
  },
  {
    name: "Desserts",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/dessert.png",
  },
  {
    name: "Coffee & Tea",
    pictureUrl:
      "https://dzfokbljn6tmk.cloudfront.net/category-logos/coffeeandtea.png",
  },
];

enum DropdownType {
  Populars,
  Results,
}

const SearchDropdown: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<Item[]>([]);
  const [showSearchButton, setShowSearchButton] = useState<boolean>(true);
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.Populars);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set focus to the search input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle search events
  useEffect(() => {
    const search = async () => {
      const result = await searchItems(query);

      if (result.items && result.items.length) {
        setQueryResults(result.items);
      } else {
        setQueryResults([]);
      }

      setIsLoading(false);
    };

    search();
  }, [query]);

  const searchOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length) {
      setIsLoading(true);
      setShowSearchButton(false);
      setDropdown(DropdownType.Results);
    } else {
      setShowSearchButton(true);
      setDropdown(DropdownType.Populars);
    }

    setQuery(event.target.value);
  };

  const searchOnClick = () => {
    if (query.length) {
      console.log("Search");
    } else {
      inputRef.current?.focus();
    }
  };

  const categoryOnClick = (category: string) => {
    setShowSearchButton(false);
    setDropdown(DropdownType.Results);
    setQuery(category);
  };

  return (
    <div className="searchdropdown-content">
      <div className="searchdropdown-searchbar">
        <input
          className="searchdropdown-searchbar-input"
          placeholder="Ho voglia di..."
          onChange={searchOnChange}
          value={query}
          ref={inputRef}
        ></input>
        {showSearchButton && (
          <button
            className="searchdropdown-searchbar-searchbtn"
            onClick={searchOnClick}
          >
            <SearchIcon fill="#343538" />
          </button>
        )}
      </div>

      <div className="searchdropdown-dropdown-content">
        {dropdown === DropdownType.Populars ? (
          <React.Fragment>
            <h2 className="searchdropdown-dropdown-popular-title">
              Ricerche popolari
            </h2>

            <ul className="searchdropdown-dropdown-popular-categories">
              {categories.map((category, idx) => {
                return (
                  <div
                    className="searchdropdown-dropdown-popular-category"
                    key={idx}
                    onClick={() => categoryOnClick(category.name)}
                  >
                    <img
                      src={category.pictureUrl}
                      className="searchdropdown-dropdown-popular-category-logo"
                    />
                    <span className="searchdropdown-dropdown-popular-category-title">
                      {category.name}
                    </span>
                  </div>
                );
              })}
            </ul>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ul className="searchdropdown-dropdown-results">
              {queryResults.map((item, idx) => {
                return <SearchItem item={item} key={idx} />;
              })}
              {queryResults.length === 0 && query.length > 1 && !isLoading ? (
                <div className="searchdropdown-noresults-content">
                  <EmptyIcon />
                  <span className="searchdropdown-noresults-message">
                    Non ci sono risultati per
                  </span>
                  <span className="searchdropdown-noresults-message">{`"${query}"`}</span>
                </div>
              ) : null}
            </ul>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
