import { databaseFacade } from "peer-pass-backend";
import { useDatabase } from "../../providers/DatabaseProvider";
import { classNames } from "../../helpers";
import { useNavigate } from "react-router";

export default function BackupDiy() {
  const nav = useNavigate();
  const { database, replication, swarm } = useDatabase();

  async function startReplicationProcess() {
    await databaseFacade.replicate({ name: "@password" });
  }

  const pre = `
// Create a directory
mkdir example-backup

// Change directory
cd example-backup

// Init NPM
npm init -y

// Install packages
npm install corestore hyperswarm

// Create index.js
touch index.js
  `.trim();

  const codeString = `
// Copy this code into the index.js
const Corestore = require("corestore");
const Hyperswarm = require("hyperswarm");

// Database Key
const key = process.argv[2];
if (!key) throw new Error("Key is required");

async function main() {
  const store = new Corestore("./backup-goes-here");
  const core = store.get({ key });
  await core.ready();

  const swarm = new Hyperswarm();
  swarm.on("connection", (conn) => {
    console.log("* Got connection");
    store.replicate(conn);
    core.download();
  });
  swarm.join(Buffer.from(core.discoveryKey, "hex"));
}
main();
    `.trim();
  const after = `
// Run it
node index.js <your_database_key>

// For example
node index.js 4BcD3f
`.trim();

  return (
    <div className="bg-white">
      <div>
        <div>
          <div className="px-4 sm:px-0">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              <span
                onClick={(e) => nav("/backup")}
                class="cursor-pointer hover:underline text-indigo-600 hover:text-indigo-400"
              >
                Backup
              </span>{" "}
              > Do It Yourself
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              All you have to do is start the process and then run the example
              script below where you want to replicate your data
            </p>

            <div>
              <ul
                role="list"
                className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
              >
                <li className="col-span-4 flex rounded-md shadow-sm">
                  <div
                    className={classNames(
                      replication.statusNull()
                        ? "bg-gray-200"
                        : replication.inProgress()
                        ? "bg-orange-200"
                        : replication.replicated()
                        ? "bg-green-200"
                        : "bg-gray-200",
                      "bg-gray-200 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-4xl font-medium text-white"
                    )}
                  >
                    {(replication.inProgress() || replication.stopped()) && (
                      <p>😴</p>
                    )}
                    {replication.replicated() && <p>🍐</p>}
                    {replication.statusNull() && <p />}
                  </div>
                  <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <p className="font-medium text-gray-900 hover:text-gray-600">
                        Replication State
                      </p>
                      <p className="text-gray-500">
                        Status: {replication.getStatus() || "---"}
                      </p>
                      <p className="text-gray-500">
                        Connections: {swarm.connectionsCount()}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="mt-2">
              {!swarm.hasKey() && (
                <button
                  onClick={startReplicationProcess}
                  type="button"
                  className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Start the process
                </button>
              )}
              {swarm.hasKey() && !swarm.hasConnections() && (
                <p class="text-xs italic">
                  Process has started. Awaiting connections...
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-1">
              <div className="border-t border-gray-100 px-4 py-4 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Database Key
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {database.key}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-4 py-4 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Connections
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                  {database.swarm?.connections?.length < 1 && (
                    <p class="italic text-xs">
                      You do not have any connections yet. Once someone joins
                      the same network as you, their ID will show up here.
                    </p>
                  )}
                  {database.swarm?.connections?.length > 0 && (
                    <ul>
                      {database.swarm?.connections.map((c) => (
                        <p key={c}>{c}</p>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <div class="mb-4">
          <h3 className="text-base font-semibold leading-7 text-gray-900">
            Example Code
          </h3>
        </div>
        <pre class="bg-gray-100 p-4 rounded-lg border-gray-200 mb-8">
          <code>{pre}</code>
        </pre>
        <pre class="bg-gray-100 p-4 rounded-lg border-gray-200 mb-8">
          <code>{codeString}</code>
        </pre>
        <pre class="bg-gray-100 p-4 rounded-lg border-gray-200">
          <code>{after}</code>
        </pre>
      </div>
    </div>
  );
}
