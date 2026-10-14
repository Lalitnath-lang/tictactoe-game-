#include <stdio.h>
#include <stdlib.h>

#define SIZE 6
#define WIN_LENGTH 4

char board[SIZE][SIZE];
int scoreX=0, scoreO=0, draws=0;

void initializeBoard(void);
void displayBoard(void);
void displayMenu(void);
int getPosition(void);
int makeMove(int row,int col,char player);
int checkWinner(int row,int col,char player);
int checkDirection(int row,int col,int rowDirection,int colDirection,char player);
int isBoardFull(void);
void playGame(void);
void displayScore(void);
void clearInputBuffer(void);

int main(void){
    int choice;
    while(1){
        displayMenu();
        printf("\nEnter your choice: ");
        if(scanf("%d",&choice)!=1){
            printf("\nInvalid input!\n");
            clearInputBuffer();
            continue;
        }
        clearInputBuffer();
        switch(choice){
            case 1: playGame(); break;
            case 2: displayScore(); break;
            case 3:
                printf("\n====================================\n");
                printf("       THANK YOU FOR PLAYING!\n");
                printf("====================================\n");
                return 0;
            default: printf("\nInvalid choice! Try again.\n");
        }
    }
}

void displayMenu(void){
    printf("\n============================================\n");
    printf("          6 x 6 TIC TAC TOE\n");
    printf("============================================\n");
    printf("       Connect 4 to win!\n");
    printf("--------------------------------------------\n");
    printf("  1. Start New Game\n");
    printf("  2. View Score\n");
    printf("  3. Exit\n");
    printf("============================================\n");
}

void initializeBoard(void){
    for(int row=0;row<SIZE;row++)
        for(int col=0;col<SIZE;col++)
            board[row][col]=' ';
}

void displayBoard(void){
    printf("\n\n       ");
    for(int col=0;col<SIZE;col++) printf(" %d   ",col+1);
    printf("\n     ");
    for(int col=0;col<SIZE;col++) printf("+---+");
    printf("\n");
    for(int row=0;row<SIZE;row++){
        printf("  %d  ",row+1);
        for(int col=0;col<SIZE;col++) printf("| %c ",board[row][col]);
        printf("|\n     ");
        for(int col=0;col<SIZE;col++) printf("+---+");
        printf("\n");
    }
}

int getPosition(void){
    int position;
    while(1){
        printf("\nEnter cell number (1-36): ");
        if(scanf("%d",&position)!=1){
            printf("Invalid input! Enter a number.\n");
            clearInputBuffer();
            continue;
        }
        clearInputBuffer();
        if(position<1||position>36){
            printf("Invalid position! Choose 1-36.\n");
            continue;
        }
        return position;
    }
}

int makeMove(int row,int col,char player){
    if(board[row][col]!=' ') return 0;
    board[row][col]=player;
    return 1;
}

int checkWinner(int row,int col,char player){
    int directions[4][2]={{0,1},{1,0},{1,1},{1,-1}};
    for(int i=0;i<4;i++){
        int count=1;
        count+=checkDirection(row,col,directions[i][0],directions[i][1],player);
        count+=checkDirection(row,col,-directions[i][0],-directions[i][1],player);
        if(count>=WIN_LENGTH) return 1;
    }
    return 0;
}

int checkDirection(int row,int col,int rowDirection,int colDirection,char player){
    int count=0;
    row+=rowDirection;
    col+=colDirection;
    while(row>=0&&row<SIZE&&col>=0&&col<SIZE&&board[row][col]==player){
        count++;
        row+=rowDirection;
        col+=colDirection;
    }
    return count;
}

int isBoardFull(void){
    for(int row=0;row<SIZE;row++)
        for(int col=0;col<SIZE;col++)
            if(board[row][col]==' ') return 0;
    return 1;
}

void displayScore(void){
    printf("\n============================================\n");
    printf("                 SCOREBOARD\n");
    printf("============================================\n");
    printf("        Player X : %d\n",scoreX);
    printf("        Player O : %d\n",scoreO);
    printf("        Draws    : %d\n",draws);
    printf("============================================\n");
}

void playGame(void){
    char currentPlayer='X';
    initializeBoard();
    printf("\n============================================\n");
    printf("             NEW GAME STARTED\n");
    printf("============================================\n");
    printf("\nPlayer X goes first!");
    printf("\nConnect 4 symbols to win.\n");

    while(1){
        int position,row,col;
        displayBoard();
        printf("\n--------------------------------------------\n");
        printf("Player %c's turn\n",currentPlayer);
        position=getPosition();
        row=(position-1)/SIZE;
        col=(position-1)%SIZE;

        if(!makeMove(row,col,currentPlayer)){
            printf("\nThat cell is already occupied!\n");
            printf("Choose another cell.\n");
            continue;
        }

        if(checkWinner(row,col,currentPlayer)){
            displayBoard();
            printf("\n============================================\n");
            printf("          PLAYER %c WINS!\n",currentPlayer);
            printf("============================================\n");
            if(currentPlayer=='X') scoreX++; else scoreO++;
            break;
        }

        if(isBoardFull()){
            displayBoard();
            printf("\n============================================\n");
            printf("             GAME DRAW!\n");
            printf("============================================\n");
            draws++;
            break;
        }

        currentPlayer=(currentPlayer=='X')?'O':'X';
    }

    displayScore();
    printf("\nPress Enter to return to menu...");
    getchar();
}

void clearInputBuffer(void){
    int character;
    while((character=getchar())!='\n'&&character!=EOF){}
}
