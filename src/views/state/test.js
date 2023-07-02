const gameMachine = createMachine(
    {
      id: 'game',
      initial: 'playing',
      context: {
        points: 0
      },
      states: {
        playing: {
          // Eventless transition
          // Will transition to either 'win' or 'lose' immediately upon
          // entering 'playing' state or receiving AWARD_POINTS event
          // if the condition is met.
          always: [
            { target: 'win', cond: 'didPlayerWin' },
            { target: 'lose', cond: 'didPlayerLose' }
          ],
          on: {
            // Self-transition
            AWARD_POINTS: {
              actions: assign({
                points: 100
              })
            }
          }
        },
        win: { type: 'final' },
        lose: { type: 'final' }
      }
    },
    {
      guards: {
        didPlayerWin: (context, event) => {
          // check if player won
          return context.points > 99;
        },
        didPlayerLose: (context, event) => {
          // check if player lost
          return context.points < 0;
        }
      }
    }
  );