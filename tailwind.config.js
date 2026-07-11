module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Custom nav breakpoint: hamburger collapses at 992px
        nav: "992px",
      },
    },
  },
  plugins: [],
};
