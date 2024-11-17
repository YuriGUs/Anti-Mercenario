// Função que será chamada quando o MutationObserver detectar mudanças no DOM
function handleMutation(mutationsList, observer) {
  mutationsList.forEach((mutation) => {
    if (mutation.type === "childList") {
      const videoContainer = document.querySelector(".pbyp-player-instance");

      if (videoContainer) {
        const videoElement = videoContainer.querySelector("video");
        if (videoElement) {
          if (videoElement.readyState >= 3) {
            // Tenta ativar o PiP
            activatePiP(videoElement);
          } else {
            videoElement.addEventListener("loadedmetadata", () => {
              activatePiP(videoElement);
            });
          }
        }
      }
    }
  });
}

// Função para ativar o PiP
function activatePiP(videoElement) {
  // Tenta ativar o PiP automaticamente
  videoElement
    .requestPictureInPicture()
    .then(() => {})
    .catch((error) => {
      console.error("Erro ao ativar PiP:", error);

      // Caso o erro seja relacionado à falta de um gesto do usuário, tentamos clicar em um botão PiP
      if (error.name === "NotAllowedError") {
        console.log("Tentando ativar PiP com gesto de usuário...");
        activatePiPWithUserGesture(); // Tentativa de simular um clique
      }
    });
}

// Função para ativar o PiP clicando no botão PiP, se disponível
function activatePiPWithUserGesture() {
  const pipButton = document.querySelector(".pbyp-player-instance .custom-button"); // Seletor correto do botão
  if (pipButton) {
    pipButton.click(); // Simula o clique
  } else {
    console.log("Botão de PiP não encontrado");
  }
}

// Cria o MutationObserver com a função de callback
const observer = new MutationObserver(handleMutation);

// Configura o observer para observar mudanças no DOM (adicionar ou remover elementos)
observer.observe(document.body, {
  childList: true, // Detecta adição ou remoção de nós
  subtree: true, // Observa o DOM inteiro
});
