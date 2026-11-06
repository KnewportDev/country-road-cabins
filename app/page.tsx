import Homepage from "../components/site/Homepage";
import { stays } from "../server/catalog.mjs";

export default function Home() {
  return <Homepage initialStays={stays} />;
}
