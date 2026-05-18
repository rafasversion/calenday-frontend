import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Modal from "../../components/Modal/Modal";
import Highlight from "../../components/Highlight/Highlight";
import Features from "../../components/Features/Features";
import Steps from "../../components/Steps/Steps";
import CTA from "../../components/CTA/CTA";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Header onOpenModal={() => setIsModalOpen(true)} />
      <Highlight />
      <Features />
      <Steps />
      <CTA onOpenModal={() => setIsModalOpen(true)} />
      <Footer />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Home;
