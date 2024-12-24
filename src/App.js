import React, { useState, useEffect } from "react";
import Papa from "papaparse"; // Import PapaParse for CSV parsing
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "./load.json";
import suggestAnimation from "./suggest1.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faGithub,
  faXTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import noDataAnimation from "./no-data.json";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [recipes, setRecipes] = useState([]); // Recipes state is used in rendering suggested recipes
  const [error, setError] = useState("");
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [showFooter, setShowFooter] = useState(true); // State to show/hide footer
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [playNoDataAnimation, setPlayNoDataAnimation] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true); // Start fade-out
      setTimeout(() => setIsLoading(false), 1000); // Remove loading after fade-out completes
    }, 4050); // Wait for 4 seconds of loading animation
    return () => clearTimeout(timer);
  }, []);

  const fadeOutStyle = {
    animation: "fadeOut 1s forwards",
  };

  // Handle suggest.json animation
  useEffect(() => {
    if (loadingSuggest) {
      const timer = setTimeout(() => {
        setLoadingSuggest(false); // End animation
        setShowSuggestions(true); // Show suggestions page
      }, 4000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [loadingSuggest]);

  useEffect(() => {
  const handleScroll = debounce(() => {
    const isBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 10; // Add a small threshold
    if (isBottom) {
      setShowFooter(true);
    } else {
      setShowFooter(true);
    }
  }, 100);

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Stack content vertically
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#fff", // Optional: Set a background color
          ...(fadeOut ? fadeOutStyle : {}),
          margin: 0,
        }}
      >
        <Player
          autoplay
          loop
          src={animationData}
          alt="Loading..."
          style={{ width: "300px", height: "auto" }} // Adjust size as needed
        />
        <div
          style={{ fontSize: "1.2rem", color: "#fc8019", marginTop: "10px" }}
        >
          <span
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              borderRight: "2px solid #fc8019",
              animation:
                "typing 4s steps(30, end), blink 0.6s step-end infinite",
                fontFamily: "Roboto Slab, serif",

            }}
          >
            <b> SomeThing Is Cooking...</b>
          </span>
          <style>
            {`
      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes blink {
        50% { border-color: transparent; }
      }
         @keyframes fadeOut {
                  from { opacity: 1; }
                  to { opacity: 0; }
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
        
    `}
          </style>
        </div>
      </div>
    );
  }

  // Function to fetch and filter recipes based on user input
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error
    setRecipes([]); // Reset recipes
    setShowSuggestions(false);
    setLoadingSuggest(true); // Start animation
    setShowFooter(false); // Hide footer while loading recipes

    // Validate ingredients input
    const trimmedIngredients = ingredients.trim();
    if (!trimmedIngredients) {
      <div style={{ textAlign: "center" }}>
        {setError("Please enter at least one ingredient.")}
      </div>;
      return;
    }

    // Parse the CSV file using PapaParse
    Papa.parse("recipe-dataset.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,

      complete: (result) => {
        const filteredRecipes = result.data.filter((recipe) => {
          // Ensure ingredients exist and process them
          const inputIngredientsList = trimmedIngredients
            .split(",")
            .map((item) => item.trim().toLowerCase());

          // Ensure recipe.ingredients exists and is a string
          const recipeIngredients =
            recipe.ingredients && typeof recipe.ingredients === "string"
              ? recipe.ingredients
                  .split(",")
                  .map((item) => item.trim().toLowerCase())
              : []; // If undefined, set as empty array

          // Modify ingredient matching to be more flexible
          const ingredientsMatch = inputIngredientsList.some((ingredient) =>
            recipeIngredients.some((recipeIng) =>
              recipeIng.includes(ingredient)
            )
          );

          // Dietary and cuisine match conditions
          const dietaryMatch = dietary
            ? recipe.dietary &&
              recipe.dietary.toLowerCase() === dietary.toLowerCase()
            : true;
          const cuisineMatch = cuisine
            ? recipe.cuisine &&
              recipe.cuisine.toLowerCase() === cuisine.toLowerCase()
            : true;

          return ingredientsMatch && dietaryMatch && cuisineMatch;
        });

        setTimeout(() => {
          setLoadingSuggest(false); // End animation
          if (filteredRecipes.length > 0) {
            setShowSuggestions(true);
            setRecipes(filteredRecipes);
          } else {
            setPlayNoDataAnimation(true); // Play no-data animation
            setTimeout(() => {
              setPlayNoDataAnimation(false);
              setShowSuggestions(false); // Reset to the main page
              setError(
                "No recipes found. Try different ingredients or filters."
              );
            }, 3000);
          }
        }, 3300); // Suggest animation delay
      },
      error: (err) => {
        setLoadingSuggest(false);
        setError("Error fetching data. Please try again.");
        console.error(err);
      },
    });
  };
  if (playNoDataAnimation) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Player
          autoplay
          loop
          src={noDataAnimation}
          style={{ width: "300px" }}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Player autoplay loop src={animationData} style={{ width: "300px" }} />
      </div>
    );
  }

  if (loadingSuggest) {
    return (
      <div
        className="fade-in"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Player
          autoplay
          loop
          src={suggestAnimation}
          style={{ width: "300px" }}
        />
      </div>
    );
  }

  if (showSuggestions) {
    return (
      <div
        className="fade-in"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            padding: "20px",
            maxWidth: "1200px",
            margin: "20px auto",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#fc8019",
              fontSize: "2rem",
              marginBottom: "20px",
              fontFamily: "'Georgia', serif ",

            }}
          >
            𝑺𝒖𝒈𝒈𝒆𝒔𝒕𝒆𝒅 𝑹𝒆𝒄𝒊𝒑𝒆𝒔
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {recipes.map((recipe, index) => (
              <div
                key={index}
                style={{
                  padding: "15px",
                  backgroundColor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={recipe.images}
                  alt={recipe.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    borderRadius: "10px",
                  }}
                />
                <h3 style={{ margin: "10px 0", color: "#fc8019" }}>
                  {recipe.name}
                </h3>
                <p
                  style={{ color: "#555", fontSize: "14px", lineHeight: "1.5" }}
                >
                  {recipe.instructions}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e67300";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fc8019";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => setShowSuggestions(false)}
              style={{
                marginTop: "15px",
                padding: "15px 20px",
                fontSize: "1rem",
                backgroundColor: "#fc8019",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#ffffff", // Replacing background with the linear gradient
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with logo */}
      <header
        style={{
          textAlign: "center",
          padding: "1px",
          backgroundColor: "#fc8019",
          width: "100%",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <img
          src="https://res.cloudinary.com/duhabjmtf/image/upload/v1733836684/kc_gensf8.png"
          alt="Kitchen Canvas Logo"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            margin: "10px auto",
          }}
        />
        <h1
          style={{
            color: "white",
            fontSize: "3rem",
            margin: "10px 0",
          }}
        >
          𝐊𝐢𝐭𝐜𝐡𝐞𝐧 𝐂𝐚𝐧𝐯𝐚𝐬
        </h1>
        <p
          style={{
            color: "white",
            fontSize: "1.2rem",
            marginTop: "0",
          }}
        >
          "𝑨 𝑷𝒍𝒂𝒚𝒈𝒓𝒐𝒖𝒏𝒅 𝒇𝒐𝒓 𝒀𝒐𝒖𝒓 𝑰𝒎𝒂𝒈𝒊𝒏𝒂𝒕𝒊𝒐𝒏."
        </p>
      </header>

      {/* Form Section */}

      <div
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "scale(1)";
        }}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginBottom: "40px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          margin: "0 auto", // Centers the form horizontally
          marginTop: "35px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <h2
            style={{
              color: "#fc8019",
              textAlign: "center",
              fontFamily: "Roboto Slab, serif",
            }}
          >
            𝙷𝚞𝚗𝚝 𝚏𝚘𝚛 𝙷𝚒𝚍𝚍𝚎𝚗 𝙵𝚕𝚊𝚟𝚘𝚛𝚜
          </h2>
          <label>
            𝖨𝗇𝗀𝗋𝖾𝖽𝗂𝖾𝗇𝗍𝗌 (𝖼𝗈𝗆𝗆𝖺-𝗌𝖾𝗉𝖺𝗋𝖺𝗍𝖾𝖽):
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="E.g., chicken, rice"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fc8019")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
              style={{
                width: "94%",
                padding: "10px",
                marginTop: "5px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontFamily: "'Georgia', serif ",
              }}
            />
          </label>
          <label>
            𝖣𝗂𝖾𝗍𝖺𝗋𝗒 𝖱𝖾𝗌𝗍𝗋𝗂𝖼𝗍𝗂𝗈𝗇𝗌:
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fc8019")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontFamily: "'Georgia', serif ",
              }}
            >
              <option value="">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </label>
          <label>
            𝖢𝗎𝗂𝗌𝗂𝗇𝖾:
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fc8019")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontFamily: "'Georgia', serif ",

              }}
            >
              <option value="">Any</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="French">French</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="American">American</option>
              <option value="Korean">Korean</option>
              <option value="Turkish">Turkish</option>
            </select>
          </label>
          <button
           onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e67300";
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fc8019";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#fc8019",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <b>𝖬𝖺𝗄𝖾 𝖺 𝖣𝗂𝗌𝗁</b>
          </button>
        </form>
        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flex: 1, padding: "20px" }}>
        {/* Famous Dishes Section */}
        <div
          style={{
            flex: 3,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            padding: "20px",
            fontFamily: " 'Poppins', 'Helvetica Neue', sans-serif",

          }}
        >
          {[
            {
              name: "𝖧𝗒𝖽𝖾𝗋𝖺𝖻𝖺𝖽 𝖣𝗎𝗆 𝖡𝗂𝗋𝗒𝖺𝗇𝗂",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734035647/chicken-hyderabadi-biryani-01_j89zfk.jpg",
              link: "https://youtu.be/nf9tq7cNkTQ?si=iUy7OOO2Mn-HtqOY",
              cuisine: "Indian",
              description:
                "A fragrant blend of spices, rice, and tender meat cooked to perfection.",
            },
            {
              name: "𝖯𝖺𝗇𝖾𝖾𝗋 𝖡𝗎𝗍𝗍𝖾𝗋 𝖬𝖺𝗌𝖺𝗅𝖺",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734035805/360_F_764777492_0Q9WP2AkE5gWqT7pceVgSV59DbAuObnv_uckvai.jpg",
              link: "https://youtu.be/oYZ--rdHL6I?si=T2ZVcKLE7rMNgoyJ",
              cuisine: "Indian",
              description:
                "A creamy tomato-based curry with soft cubes of paneer (Indian cottage cheese).",
            },
            {
              name: "𝖡𝗎𝗍𝗍𝖾𝗋 𝖢𝗁𝗂𝖼𝗄𝖾𝗇",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734036080/mouthwatering-butter-chicken-curry-with-creamy-tomato-sauce_1272857-98322_wlhzdx.jpg",
              link: "https://youtu.be/a03U45jFxOI?si=IpcM8q3Fk1KVxdSi",
              cuisine: "Indian",
              description:
                "A rich, creamy curry made with marinated chicken cooked in butter and spices.",
            },
            {
              name: "𝖯𝖺𝗌𝗍𝖺 𝖢𝖺𝗋𝖻𝗈𝗇𝖺𝗋𝖺",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734036289/MSL-341240-Quick-Carbonara-hero-3x2-6889-8c65cdf67f1149189b492c4def3c02e5_zqhvbw.webp",
              link: "https://youtu.be/D_2DBLAt57c?si=SAE8ht3ilS4CSCc8",
              cuisine: "Italian",
              description:
                "Pasta Carbonara is a Roman dish with eggs, pecorino cheese, guanciale, and black pepper tossed with spaghetti.",
            },
            {
              name: "𝖯𝖺𝖽 𝖳𝗁𝖺𝗂",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734036410/pad-thai-vegetarian-plant-based-asian-recipe-from-thailand_uwwx38.jpg",
              link: "https://youtu.be/zy_P70hXhdM?si=nCqhTCLuyNWXsvB7",
              cuisine: "Thai",
              description:
                "Pad thai is a stir-fried rice noodle dish with tofu, shrimp, peanuts, eggs, and tamarind sauce.",
            },
            {
              name: "𝖪𝗎𝗇𝗀 𝖯𝖺𝗈 𝖢𝗁𝗂𝖼𝗄𝖾𝗇",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734026932/download_x2onhf.jpg",
              link: "https://youtu.be/Ar3qVJyfSVs?si=fn1kEoDlGD3ceLJ-",
              cuisine: "Chinese",
              description:
                "Kung Pao Chicken is a spicy Sichuan dish with diced chicken, peanuts, vegetables, and chili peppers.",
            },
            {
              name: "𝖢𝗁𝗂𝗅𝖾𝗌 𝖾𝗇 𝖭𝗈𝗀𝖺𝖽𝖺",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734026932/download_x2onhf.jpg",
              link: "https://youtu.be/g5QcDLIOfBY?si=g7wc6-DW-X6v-E9j",
              cuisine: "Mexican",
              description:
                "Chiles en Nogada is a Mexican dish with poblano peppers stuffed with meat, topped with walnut sauce and pomegranate.",
            },
            {
              name: "𝖢𝗈𝗊 𝖺𝗎 𝖵𝗂𝗇",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734035486/Coq-au-Vin_awxux9.jpg",
              link: "https://youtu.be/hJswLfXL_GA?si=qF21_Hw5Q3kgIu1z",
              cuisine: "French",
              description:
                "Coq au Vin is a classic French dish of chicken braised in red wine with mushrooms, onions, garlic, and herbs.",
            },
            {
              name: "𝖲𝗎𝗌𝗁𝗂",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734028326/166337588363251a0b23315_k2tgjz.jpg",
              link: "https://youtu.be/aDQxH-KpCCc?si=jt1hZdBLKKeSpt8g",
              cuisine: "Japanese",
              description:
                "Sushi is a traditional Japanese dish featuring vinegared rice, fresh seafood, vegetables, and seaweed, offering diverse flavors and textures.",
            },
            {
              name: "𝖧𝖺𝗆𝖻𝗎𝗋𝗀𝖾𝗋",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1733850501/burger_nd5hjt.png",
              link: "https://youtu.be/foD42-73wdI?si=ej6kX6vuwDyC0Nv3",
              cuisine: "American",
              description:
                "A hamburger is a sandwich with a cooked beef patty, often topped with lettuce, tomato, cheese, and condiments on a bun.",
            },
            {
              name: "𝖡𝗂𝖻𝗂𝗆𝖻𝖺𝗉",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734035088/medium_729_iwymzs.jpg",
              link: "https://youtu.be/lqUtV6lT1n4?si=bjhxbcxQpAPZ3mbb",
              cuisine: "Korean",
              description:
                "Bibimbap is a Korean dish with rice, mixed vegetables, meat, and egg, topped with spicy gochujang sauce. Delicious and nutritious!",
            },
            {
              name: "𝖨𝗌𝗄𝖾𝗇𝖽𝖾𝗋 𝖪𝖾𝖻𝖺𝖻",
              img: "https://res.cloudinary.com/duhabjmtf/image/upload/v1734036604/turkish-iskender-kebab_kozrwo.jpg",
              link: "https://youtu.be/Non4ZqMgDPY?si=8nUeah3FoIXUgI0D",
              cuisine: "Turkish",
              description:
                "Aİskender Kebab is a Turkish dish featuring thinly sliced lamb or beef, served over pita bread, topped with yogurt and tomato sauce.",
            },
          ].map((dish, index) => (
            <div
              key={index}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#FFE5B4"; // Light orange background
                e.currentTarget.style.boxShadow =
                  "0 6px 12px rgba(252, 128, 25, 0.3)"; // Orange shadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "white"; // Default background
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Default shadow
              }}
              style={{
                backgroundColor: "white",
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "all 0.3s ease",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <a
                href={dish.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={dish.img}
                  alt={dish.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "15px 15px 0 0",
                  }}
                />
                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      margin: "0 0 10px",
                      color: "#fc8019",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {dish.name}
                  </h3>
                  <p
                    style={{
                      color: "#777",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    <b>{dish.cuisine}</b>
                  </p>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {dish.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <footer
          style={{
           backgroundColor: "#fc8019",
      color: "#fff",
      textAlign: "center",
      width: "calc(100% - 80px)", // Adjust width to account for margins
      padding: "10px 20px",
      marginTop: "10px", // Space between the recipes and footer
      marginRight: "20px", // Right gap
      marginLeft: "20px", // Left gap
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
      borderBottomLeftRadius: "10px",
      borderBottomRightRadius: "10px",
          }}
        > <p>
          style ={{
             fontFamily: "'Georgia', serif ",

          }}

            <b>𝖬𝖠𝖭𝖨𝖣𝖤𝖤𝖯𝖠𝖪 𝖱𝖤𝖣𝖣𝖸 𝖡𝖮𝖣𝖨𝖦𝖠𝖬</b>
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "15px" }}
          >
            <a
              href="https://github.com/manideepak12"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a
              href="https://www.linkedin.com/in/manideepak-reddy-bodigam-/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href="https://www.instagram.com/m_a_n_i_1_2/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://twitter.com/mani_12_"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a
              href="https://drive.google.com/file/d/1tuNFMqqBk9LhET72etWGfHk5tPDG0AJ4/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faFile} />
            </a>
            <a
              href="https://wa.me/918074955963"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
