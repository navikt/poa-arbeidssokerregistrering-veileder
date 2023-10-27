import styles from './progress-bar.module.css';

interface Props {
    value: number;
    className?: string;
}

const hentBredde = (value: number) => {
    return 100 * value;
};

const ProgressBar = (props: Props) => {
    return (
        <div className={`${styles.progress} ${props.className || ''}`}>
            <div
                style={{ width: `${hentBredde(props.value)}%` }}
                className={styles.progressBar}
                role="progressbar"
                title={`Fremdrift: ${hentBredde(props.value)} prosent ferdig`}
                aria-valuenow={props.value}
                aria-valuemin={0}
                aria-valuemax={1}
            />
        </div>
    );
};

export default ProgressBar;
