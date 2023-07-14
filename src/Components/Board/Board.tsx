import Cell from '../Cell/Cell';

const Board = () => {
    return (
        <div className="w-[70vh] h-[70vh] bg-slate-500 p-2">
            <div className="bg-sky-300 opacity-50 w-full h-full border flex flex-wrap">
                { [ ...Array( 100 ) ].map( num => <Cell key={ num }/> ) }
            </div>
        </div>
    );
};

export default Board;
