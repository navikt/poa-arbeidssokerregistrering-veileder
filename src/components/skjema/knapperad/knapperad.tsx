import Neste from './neste-knapp';

interface Knapperadprops {
    onNeste: () => void;
}

export const Knapperad = (props: Knapperadprops) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <Neste onClick={props.onNeste} />
        </div>
    );
};
