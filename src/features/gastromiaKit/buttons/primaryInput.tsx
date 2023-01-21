import React, { useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import "./primaryInput.css";

const divVariants: Variants = {
  rest: {
    borderColor: "#e3e3e3",
    transition: { duration: 0.2 },
  },
  focus: {
    borderColor: "#00AD0A",
    transition: { duration: 0.2 },
  },
  filled: {
    borderColor: "#e3e3e3",
    transition: { duration: 0.2 },
  },
};

const labelVariants: Variants = {
  rest: {
    top: "calc(50% - 11px)",
    left: "12px",
    fontSize: "15px",
    scale: 1,
    color: "#343538",
    transition: { duration: 0.2 },
  },
  focus: {
    top: "2px",
    left: "12px",
    fontSize: "12px",
    color: "#00AD0A",
    transition: { duration: 0.2 },
  },
  filled: {
    top: "2px",
    left: "12px",
    fontSize: "12px",
    color: "#343538",
    transition: { duration: 0.2 },
  },
};

enum PrimaryInputState {
  Rest = "rest",
  Focused = "focus",
  Filled = "filled",
}

const PrimaryInput: React.FC<{
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  options: {
    labelTitle: string;
    style?: React.CSSProperties;
  };
}> = ({ value, onChange, options }) => {
  const [state, setState] = useState<PrimaryInputState>(PrimaryInputState.Rest);
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      variants={divVariants}
      animate={state}
      className="primaryinput"
      style={options.style}
      onClick={() => {
        setState(PrimaryInputState.Focused);
        inputRef.current?.focus();
      }}
      ref={divRef}
    >
      <motion.label
        variants={labelVariants}
        animate={state}
        className="primaryinput-label"
      >
        {options.labelTitle}
      </motion.label>
      <input
        className="primaryinput-input"
        ref={inputRef}
        onChange={onChange}
        type="text"
        value={value}
        onFocus={() => setState(PrimaryInputState.Focused)}
        onBlur={() => {
          if (value.length) {
            setState(PrimaryInputState.Filled);
          } else {
            setState(PrimaryInputState.Rest);
          }
        }}
      />
    </motion.div>
  );
};

export default PrimaryInput;
