import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { input } = router.query;

  const [link, setLink] = useState(input || "");
  const [err, setError] = useState("");
  const [token, setToken] = useState(""); // Initialize token with the input parameter
  const [disableInput, setDisableInput] = useState(false);

  const { data, error, isLoading } = useSWR(
    token ? [`/api?data=${encodeURIComponent(token)}`] : null,
    ([url]) => fetchWithToken(url),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data || error) {
      setDisableInput(false);
      setLink("");
    }
    if (err || error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [err, error, data]);

  useEffect(() => {
    // Set the initial value of the link state with the query parameter
    setLink(input || "");
    // Set the initial value of the token state with the query parameter
    setToken(input || "");
  }, [input]);

  async function Submit() {
    setError("");
    setDisableInput(true);
    if (!link) {
      setError("Please enter a link");
      return;
    }
    if (!checkUrlPatterns(link)) {
      setError("Invalid Link");
      return;
    }
    const secretKey = "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d";
    const expirationTime = Date.now() + 20000;
    const dataToEncrypt = JSON.stringify({
      token: link,
      expiresAt: expirationTime,
    });
    const encryptedData = CryptoJS.AES.encrypt(
      dataToEncrypt,
      secretKey
    ).toString();
    setToken(encryptedData);
  }

  return (
    <div className="pt-6 mx-12">
      {/* ... (Rest of the component) */}
    </div>
  );
}
