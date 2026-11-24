> 🚧 **Status: active development.** It works for the author; interfaces may change.

# jev-demo

[Türkçe](README.tr.md)

A small Next.js demo UI called "Jev Karar Laboratuvarı" (decision lab). It shows how a routing / risk / priority "decision" screen could look: you type a short synthetic text, pick one of three experiments, and the page returns an answer, probabilities and a decision (`SHADOW_ALLOW`, `SHADOW_BLOCK`, `HUMAN_REVIEW`).

**No model runs here.** The results come from fixed, hand-written example rules, not from Jev or any other model or provider. The percentages are not measured probabilities and the decisions are not authority to act on anything. Enter synthetic data only; there are no integrations, no API keys and no accounts.

**Jev is a third-party product. This repository is an independent demo of an interface and is not affiliated with, endorsed by or sponsored by Jev or its makers.** The name is used only to say what the screen imitates.

## Quick start

Requirements: Node.js 22.18 or newer (the tests use Node's built-in TypeScript support; Node 24 is recommended).

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
```

Open `http://127.0.0.1:3000`. `--ignore-scripts` blocks install scripts; it does not prove the packages are safe.

## Tests

```sh
npm run typecheck
npm run test:domain      # domain rules and request-race gate
npm run build
npm start                # in one terminal, then in another:
npm run test:api         # synthetic HTTP tests against 127.0.0.1:3000
```

Make sure port 3000 is not used by another application before running `test:api`; the test does not follow redirects.

## API

`POST /api/evaluate` takes a JSON object: `experiment` is one of `route`, `risk`, `priority`; `input` is a non-empty string (after trimming) of at most 4000 UTF-16 code units. Invalid JSON or a failed validation returns HTTP 400 with `{"error":"..."}`.

```json
{"experiment":"route","input":"fatura"}
```

A successful response (HTTP 200, `cache-control: no-store`) contains `mode: "DEMO"`, `experiment`, `answer` (`kind`, `value`, `probabilities`), `decision`, `reviewReasons` and `metadata` (`status`, `model`, `latencyMs`). For the example above, `answer.value` is `billing` and `decision` is `SHADOW_ALLOW`.

## Limits

- Verified on Windows x64 with Node 24 / npm 11: typecheck, 4 domain tests, production build and 3 HTTP API tests pass. CI runs the same steps on a Windows runner; Linux and macOS are untested (the lock file was derived on Windows x64).
- Visual acceptance in a browser and an independent licence review of every dependency are not done. Distributing installed packages or platform binaries (for example the optional image libraries) has its own obligations; see `THIRD-PARTY.md` and `third-party/`.
- The UI text is Turkish. Provenance and scope notes are in `KOKEN-VE-KAPSAM.md` (Turkish).

## Turkey-specific notes

The interface language and the example inputs ("fatura" = invoice, and so on) are Turkish; the Turkish README is `README.tr.md`.

## License

No license is granted. The rights chain of the application code has not been confirmed, so this repository is published for reading only; all rights reserved. Third-party packages keep their own licenses (see `THIRD-PARTY.md`). The notices under `third-party/` are license texts and may contain the package authors' contact addresses. Report security issues privately, see `SECURITY.md`.
