import { useState, useEffect } from "react";
import DOMPurify from 'dompurify';
import moment from 'moment-timezone';
import { useSearchParams, usePathname } from "next/navigation";

// props
type JobProps = {
    dateStarted: Date;
    dateEnded: Date,
    company: string;
    position: string;
    responsibilities: string;
    techStacks: string[];
};

// Array jobs info with only Minecraft experience
const jobs: JobProps[] = [
    {
        dateStarted: new Date("2020-01-15"),
        dateEnded: new Date("2023-12-31"),
        company: "Minecraft Server - XYZ",
        position: "Server Admin & Developer",
        responsibilities: `
            <div>
                <span class="text-gray-400">Managed and developed a Minecraft server, ensuring smooth gameplay and server performance for 200+ concurrent players.</span>
                <br/><strong>Highlights:</strong>
                <ul class="list-disc ml-5 mt-2">
                    <li>Implemented custom plugins to enhance server functionality and improve player engagement.</li>
                    <li>Optimized server performance, reducing lag and improving player experience.</li>
                    <li>Led server maintenance, bug fixes, and upgrades.</li>
                    <li>Handled player issues, moderated the community, and ensured a positive experience for all users.</li>
                </ul>
            </div>
        `,
        techStacks: ["Java", "Spigot", "Bukkit", "MySQL", "Linux", "SSH", "Discord"],
    },
];

const JobExperience = () => {
    const [selectedJob, setSelectedJob] = useState<JobProps | null>(null);
    const [jobIdCache, setJobIdCache] = useState(-1);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const hash = window.location.hash.substring(1); // Extract hash without '#'
        if (hash.split("?")[0] === 'tech-stack') {
            const hash = window.location.hash.substring(1); // extract without the #
            const urlParams = new URLSearchParams(hash.split('?')[1] || '');
            const jobId: any = jobIdCache !== -1 ? jobIdCache : urlParams.get('job') || 0;

            if (jobs[parseInt(jobId)]) {
                setSelectedJob(jobs[parseInt(jobId)]);
                window.history.pushState(null, '', `${pathname}#tech-stack?tab=experience&job=${jobId !== -1 ? jobId : 0}`);
            } else {
                window.history.pushState(null, '', `${pathname}#tech-stack?tab=experience&job=${jobId !== -1 ? jobId : 0}`);
                setSelectedJob(jobs[jobId !== -1 ? jobId : 0]);
            }
        }
    }, [pathname, searchParams]);

    const handleJobClick = (job: JobProps, index: number) => {
        setJobIdCache(index)
        setSelectedJob(job);
        window.history.pushState(null, '', `${pathname}#tech-stack?tab=experience&job=${index}`);
    };

    const arrTags: Array<string> = ['b', 'i', 'span', 'strong', 'a', 'div', 'ul', 'li', 'em', 'br'];
    const arrAttr: Array<string> = ['href', 'class'];
    const sanitizedResponsibilities = selectedJob ? DOMPurify.sanitize(selectedJob.responsibilities, {
        ALLOWED_TAGS: arrTags,
        ALLOWED_ATTR: arrAttr
    }) : '';

    return (
        <div className="flex flex-col md:flex-row gap-5">
            <div className="flex-shrink-0 overflow-x-auto border-r border-gray-300 dark:border-gray-700 md:h-[400px] md:w-[300px] sm:w-full sm:h-[150px] sm:overflow-x-scroll">
                <ul className="flex md:flex-col flex-row sm:flex-nowrap gap-4 p-2 overflow-x-auto">
                    {jobs.map((job, index) => {
                        const startDate = moment(job.dateStarted).tz('Asia/Manila');
                        const endDate = moment(job.dateEnded).tz('Asia/Manila');
                        const duration = moment.duration(endDate.diff(startDate));

                        const years = duration.years();
                        const months = duration.months();
                        const formattedDuration = `${years} yr${years !== 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`;

                        return (
                            <li
                                key={index}
                                className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ease-in-out md:w-full sm:w-[200px] ${selectedJob === job ? "bg-teal-600 text-white" : "bg-gray-100 dark:bg-gray-700"} hover:bg-teal-500 hover:text-white`}
                                onClick={() => handleJobClick(job, index)}
                            >
                                <div className="flex justify-start flex-col">
                                    <span className="text-lg md:text-xl font-semibold dark:text-gray-100">
                                        {`${moment(job.dateStarted).format("YYYY")} - ${moment(job.dateEnded).format("YYYY")}`}
                                    </span>
                                    <span className="text-[11px] p-0 m-0 dark:text-gray-100">{formattedDuration}</span>
                                    <p className="text-xs md:text-sm dark:text-gray-200">{job.company}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="flex-1 p-5 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
                {selectedJob && (
                    <>
                        <h3 className="text-2xl font-bold text-teal-400">{selectedJob.position}</h3>
                        <p className="text-gray-600 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: sanitizedResponsibilities }} />
                        <div className="mt-4">
                            <strong>Tech Stacks:</strong>
                            <ul className="list-disc ml-5">
                                {selectedJob.techStacks.map((tech, index) => (
                                    <li key={index} className="text-gray-500 dark:text-gray-300">{tech}</li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobExperience;