import { useState, useRef, useEffect } from "react";

export const useDateRange = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const apply = () => {
    if (!startDate || !endDate || startDate > endDate) return;
    const fmt = (d: string) => d.split("-").reverse().join("/");
    setDisplayValue(`${fmt(startDate)} - ${fmt(endDate)}`);
    setIsOpen(false);
  };

  return {
    containerRef,
    isOpen,
    setIsOpen,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    displayValue,
    apply,
  };
};