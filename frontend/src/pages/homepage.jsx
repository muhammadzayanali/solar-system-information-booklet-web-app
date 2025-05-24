import React from "react";
import Header from "../components/header";

const HomePage = () => {
  return (
    <div className="relative bg-slate-900">
      <div>
        <Header />
      </div>

      <div className="relative w-full h-[150px]">
        <video
          className="absolute md:top-[425px] md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 min-w-full object-fill brightness-50 duration-1000"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="vedio.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 pt-[100px] flex justify-center">
          <h1 className="text-6xl text-white font-bold">
            Solar Information System
          </h1>
        </div>
      </div>
      <div className="h-[500px]">
        
      </div>
      <div>
        <div className="p-9 mt-96 text-center">
          <h1 className="text-4xl text-white font-bold">
            Welcome to the Solar Information System
          </h1>
          <p className="text-white text-lg mt-4 p-6">
            This is a simple web application that provides information about the
            solar system. You can learn about the planets, asteroids, comets,
            and other celestial objects in the solar system. You can also take a
            quiz to test your knowledge about the solar system.
          </p>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-3 justify-center items-center p-0">
        <div className="w-full p-6 flex flex-col gap-5">
          <h1
            className="text-blue-300 text-4xl font-semibold"
            style={{ fontFamily: "Nothing You Could Do, cursive" }}
          >
            Planets
          </h1>
          <p className="text-white text-xl">
            Planets are large celestial bodies that orbit a star, such as the
            Sun, and are massive enough to be rounded by their own gravity while
            clearing their orbits of other debris. In our Solar System, there
            are eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn,
            Uranus, and Neptune. The inner planets (Mercury, Venus, Earth, and
            Mars) are rocky, while the outer planets (Jupiter, Saturn, Uranus,
            and Neptune) are gas giants or ice giants. Each planet has unique
            characteristics, atmospheres, and, in some cases, moons that orbit
            them.
          </p>
        </div>
        <div className="w-full">
          <img className=" w-full" src="home.jpg" alt="image" />
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-3 justify-center items-center p-0">
        <div className="w-full">
          <img className=" w-full" src="comets.jpg" alt="image" />
        </div>
        <div className="w-full p-6 flex flex-col gap-5">
          <h1
            className="text-blue-300 text-4xl font-semibold"
            style={{ fontFamily: "Nothing You Could Do, cursive" }}
          >
            Comets
          </h1>
          <p className="text-white text-xl">
            Comets, on the other hand, are icy celestial objects that originate
            from the outer regions of the Solar System, such as the Kuiper Belt
            and Oort Cloud. When they approach the Sun, the heat causes their
            icy cores to vaporize, forming glowing tails of gas and dust that
            extend for millions of kilometers. Comets have highly elliptical
            orbits and can take decades, centuries, or even longer to complete
            one revolution around the Sun. Famous comets like Halley’s Comet
            return periodically, while others may only pass through the inner
            Solar System once before being ejected into deep space.
          </p>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-3 justify-center items-center p-0">
        <div className="w-full p-6 flex flex-col gap-5">
          <h1
            className="text-blue-300 text-4xl font-semibold"
            style={{ fontFamily: "Nothing You Could Do, cursive" }}
          >
            Astroids
          </h1>
          <p className="text-white text-xl">
            Asteroids are small, rocky objects that orbit the Sun, mostly found
            in the asteroid belt between Mars and Jupiter. They are remnants
            from the early Solar System that never formed into planets due to
            gravitational disturbances, mainly from Jupiter. Asteroids vary in
            size, from tiny pebbles to massive bodies like Ceres, which is
            considered a dwarf planet. Some asteroids have irregular shapes and
            may contain metal, ice, or organic compounds. Occasionally,
            asteroids collide with Earth, causing significant impact events.
          </p>
        </div>
        <div className="w-full">
          <img className=" w-full" src="astroid.jpg" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
