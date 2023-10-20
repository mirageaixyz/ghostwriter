<img src="./ghostwriter.png">

<br/>

# ghostwriter

Proprietary content production software by [Mirage AI](https://mirageai.xyz). 

Made to create content on the fly including writing draft scripts, voice acting, and video editing.

## Setting up

**Install depencencies**

```bash
pnpm install
```

**Get a base video for the content**

```bash
cp video.mp4 ./video.mp4
```

An example of a base video is [here](https://drive.google.com/file/d/1p5y0J-pm7C6toOgg0AHiFidzsq0KTlQc/view?usp=sharing).

**Provide the required environment variables**

```bash
cp .env.example .env
```

Make sure to fill in the environment variables in `.env` with the required values.

**Generate a video**

```bash
pnpm produce
```