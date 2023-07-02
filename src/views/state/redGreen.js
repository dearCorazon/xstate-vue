const lightMachine = Machine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBsCWUAWAXAsgQwGMNUA7MAOgCdIBiAYQBkBJOgaQG0AGAXUVAAcA9rFRZUgknxAAPRAEYAbAvIAWAOwBOOQFYNnOSoUAOJWoA0IAJ6IATJxvkbczhpU7OK7Ue1yAvr4s0TFxCYjJyKGowEnpmNi5eJBAhETEJKVkEAGYNLPINDSc1FRtXYs8si2sEOwcnFzdtDy8ff0D0bHwiUgpLMGRkQQB3WJYOHikU0XFJJMycvIKikrKVCqrEIzlVTTli504s7WL-AJASQQg4KSDO0J7J4Wn0ucQAWgUNhA+2kFuQ7rhagQR6pGYZRAlL5GNTkbTqYq6exNfQqX7-LphCiRMDRUHPWagTI2YpwuRZfTaGxGTicY4mL61cgKDS7PRbDQKHIKdEdAFY8h9AbDfFpQkyRBNBz2BSHOmyuQ6cxWRB6cgeNRqbRZIwqVneDRGU6+IA */
    id: 'lightMachine',
    initial: 'red', 
    states: {
      red: {
        on: {
          CLICK: 'green',
        }
      },
      green: {
        on: {
          CLICK: 'yellow',
        }
      },
      yellow: {
        on: {
          CLICK: 'red',
        }
      },
    }
  });