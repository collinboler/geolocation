---
language: en
license: mit
library_name: pytorch
model-index:
- name: baseline
  results:
  - task:
      type: Geoscore
    dataset:
      name: OSV-5M
      type: geolocation
    metrics:
    - type: geoscore
      value: 3361
  - task:
      type: Haversine Distance
    dataset:
      name: OSV-5M
      type: geolocation
    metrics:
    - type: haversine distance
      value: 1814
  - task:
      type: Country classification
    dataset:
      name: OSV-5M
      type: geolocation
    metrics:
    - type: country accuracy
      value: 68
  - task:
      type: Region classification
    dataset:
      name: OSV-5M
      type: geolocation
    metrics:
    - type: region accuracy
      value: 39.4
  - task:
      type: Area classification
    dataset:
      name: OSV-5M
      type: geolocation
    metrics:
    - type: area accuracy
      value: 10.3
  - task:
      type: City classification
    dataset:
      name: OSV-5M
      type: geolocation
    metrics:
    - type: city accuracy
      value: 5.9
---
![image/png](https://cdn-uploads.huggingface.co/production/uploads/654bb2591a9e65ef2598d8c4/mmTZy5ELTwLiLap8pO4xV.png)

# OpenStreetView-5M <br><sub>The Many Roads to Global Visual Geolocation 📍🌍</sub>

**First authors:** [Guillaume Astruc](https://gastruc.github.io/), [Nicolas Dufour](https://nicolas-dufour.github.io/), [Ioannis Siglidis](https://imagine.enpc.fr/~siglidii/)  
**Second authors:** [Constantin Aronssohn](), Nacim Bouia, [Stephanie Fu](https://stephanie-fu.github.io/), [Romain Loiseau](https://romainloiseau.fr/), [Van Nguyen Nguyen](https://nv-nguyen.github.io/), [Charles Raude](https://imagine.enpc.fr/~raudec/), [Elliot Vincent](https://imagine.enpc.fr/~vincente/), Lintao XU, Hongyu Zhou  
**Last author:** [Loic Landrieu](https://loiclandrieu.com/)  
**Research Institute:** [Imagine](https://imagine.enpc.fr/), _LIGM, Ecole des Ponts, Univ Gustave Eiffel, CNRS, Marne-la-Vallée, France_  

## Introduction 🌍
[OpenStreetView-5M](https://huggingface.co/datasets/osv5m/osv5m) is the first large-scale open geolocation benchmark of streetview images.  
To get a sense of the difficulty of the benchmark, you can play our [demo](https://huggingface.co/spaces/osv5m/plonk).  
Our dataset was used in an extensive benchmark of which we provide the best model.  
For more details and results, please check out our [paper](https://arxiv.org/abs/2404.18873) and [project page](https://imagine.enpc.fr/~ioannis.siglidis/osv5m/).  

### Inference 🔥
![image/png](https://cdn-uploads.huggingface.co/production/uploads/654bb2591a9e65ef2598d8c4/0Z-GMa6SSLgXFmrplC0WD.png)

Our best model on OSV-5M can also be found on [huggingface](https://huggingface.co/osv5m/baseline).  
First download the repo `!git clone https://github.com/gastruc/osv5m`.
Then from any script whose `cwd` is the repos main directory (`cd osv5m`) run:

```python
from PIL import Image
from models.huggingface import Geolocalizer

geoloc = Geolocalizer.from_pretrained('osv5m/baseline')
img = Image.open('.media/examples/img1.jpeg')
x = geoloc.transform(img).unsqueeze(0) # transform the image using our dedicated transformer
gps = geoloc(x) # B, 2 (lat, lon - tensor in rad)
```

To reproduce results for this model, run:

```bash
python evaluation.py exp=eval_best_model dataset.global_batch_size=1024
```

### Citing 💫

```bibtex
@article{osv5m,
    title = {{OpenStreetView-5M}: {T}he Many Roads to Global Visual Geolocation},
    author = {Astruc, Guillaume and Dufour, Nicolas and Siglidis, Ioannis
      and Aronssohn, Constantin and Bouia, Nacim and Fu, Stephanie and Loiseau, Romain
      and Nguyen, Van Nguyen and Raude, Charles and Vincent, Elliot and Xu, Lintao
      and Zhou, Hongyu and Landrieu, Loic},
    journal = {CVPR},
    year = {2024},
  }
```