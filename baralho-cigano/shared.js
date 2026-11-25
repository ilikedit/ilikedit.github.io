(function () {
  const cfg = window.PAGE_I18N;
  if (!cfg) return;

  const assetPrefix = cfg.assetPrefix || "assets";

  // Interactive card draw
  const flipBtn = document.getElementById("flipCardBtn");
  const drawAgainBtn = document.getElementById("drawAgainBtn");
  const drawnImg = document.getElementById("drawnCardImg");
  const drawKeyword = document.getElementById("drawKeyword");
  const drawTitle = document.getElementById("drawTitle");
  const drawMessage = document.getElementById("drawMessage");
  const flipHint = document.getElementById("flipHint");
  const deck = cfg.cards || [];

  if (flipBtn && drawAgainBtn && deck.length) {
    let currentIndex = -1;
    let isAnimating = false;

    function pickNextIndex() {
      if (deck.length <= 1) return 0;
      let next;
      do {
        next = Math.floor(Math.random() * deck.length);
      } while (next === currentIndex);
      return next;
    }

    function revealCard() {
      if (isAnimating) return;
      const applyCard = () => {
        currentIndex = pickNextIndex();
        const card = deck[currentIndex];
        drawnImg.src = `${assetPrefix}/card_${card.num}.webp`;
        drawnImg.alt = card.title;
        drawKeyword.textContent = card.keyword;
        drawTitle.textContent = card.title;
        drawMessage.textContent = card.message;
        if (flipHint) flipHint.style.display = "none";
        if (cfg.drawAgainLabel) drawAgainBtn.textContent = cfg.drawAgainLabel;
        flipBtn.classList.add("is-flipped");
      };

      if (flipBtn.classList.contains("is-flipped")) {
        isAnimating = true;
        flipBtn.classList.remove("is-flipped");
        setTimeout(() => {
          applyCard();
          isAnimating = false;
        }, 360);
      } else {
        applyCard();
      }
    }

    flipBtn.addEventListener("click", revealCard);
    drawAgainBtn.addEventListener("click", revealCard);
  }

  // Thematic deck selector
  const deckButtons = document.querySelectorAll(".deck-chip[data-deck]");
  const cardImgs = document.querySelectorAll(".mini-card img[data-card-num]");
  const activeLabel = document.getElementById("activeDeckLabel");
  const decks = cfg.decks || {};
  let activeDeckId = "classico";

  function getDeckCardSrc(deckId, num) {
    if (deckId === "classico") {
      return `${assetPrefix}/card_${num}.webp`;
    }
    return `${assetPrefix}/decks/${deckId}/card_${num}.webp`;
  }

  function selectDeck(deckId) {
    const deckName = decks[deckId];
    if (!deckName || deckId === activeDeckId) return;
    activeDeckId = deckId;

    deckButtons.forEach((btn) => {
      const selected = btn.dataset.deck === deckId;
      btn.classList.toggle("is-active", selected);
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    if (activeLabel) {
      activeLabel.textContent = `${cfg.showingPrefix || "Exibindo:"} ${deckName}`;
    }

    cardImgs.forEach((img) => {
      const num = img.dataset.cardNum;
      const cardName = img.dataset.cardName || `Card ${num}`;
      const nextSrc = getDeckCardSrc(deckId, num);
      img.classList.add("is-switching");
      const onDone = () => img.classList.remove("is-switching");
      img.onload = onDone;
      img.onerror = onDone;
      img.src = nextSrc;
      img.alt = `${cardName} (${deckName})`;
      if (img.complete) onDone();
    });
  }

  deckButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectDeck(btn.dataset.deck));
  });
})();
