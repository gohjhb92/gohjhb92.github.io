const filterButtons = document.querySelectorAll(".filter-button");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    workCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const moreWorkNavLink = [...document.querySelectorAll('.nav-links a')].find(
  (link) => link.getAttribute('href') === '#more-work'
);

if (moreWorkNavLink) {
  moreWorkNavLink.textContent = 'Writing';
}

const writingList = document.querySelector('#more-work .compact-list');

if (writingList && !document.querySelector('[href="./articles/ai-fintech-startups-singapore.html"]')) {
  const articleCard = document.createElement('article');
  articleCard.className = 'featured-writing';
  articleCard.innerHTML = `
    <span>Market Research Article</span>
    <h3>AI FinTech Startups in Singapore</h3>
    <p>A portfolio research article mapping AI-fintech startup opportunities across regtech, credit underwriting, wealthtech, insurtech, payments, and personal finance.</p>
    <a href="./articles/ai-fintech-startups-singapore.html">Read Article</a>
  `;
  writingList.prepend(articleCard);
}
