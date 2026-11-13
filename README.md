<div align="center">

# Bayes Models

**Bayesian regression, group comparisons, and partial pooling on restaurant bills**

![Python](assets/badges/python.svg) ![PyMC](assets/badges/pymc.svg) ![ArviZ](assets/badges/arviz.svg) ![Bayesian models](assets/badges/models.svg) ![244 bills](assets/badges/data.svg) ![24 figures](assets/badges/gallery.svg)

</div>

---

## Live Links

| What | Link |
| --- | --- |
| Repository | [https://github.com/rohaan2802/Bayes_Models](https://github.com/rohaan2802/Bayes_Models) |
| Website | [https://rohaan2802.github.io/Bayes_Models/](https://rohaan2802.github.io/Bayes_Models/) |
| Dataset source | [https://vincentarelbundock.github.io/Rdatasets/doc/reshape2/tips.html](https://vincentarelbundock.github.io/Rdatasets/doc/reshape2/tips.html) |

---

## Table of Contents

1. [Live Links](#live-links)
2. [Overview](#overview)
3. [What's Inside](#whats-inside)
4. [Data and Exploration](#data-and-exploration)
5. [Model Inventory](#model-inventory)
6. [Analysis Workflow](#analysis-workflow)
7. [Tip Amount Regression](#tip-amount-regression)
8. [Tip-Rate Group Comparisons](#tip-rate-group-comparisons)
9. [Hierarchical Party-Size Models](#hierarchical-party-size-models)
10. [Tip-Rate Regression](#tip-rate-regression)
11. [Likelihoods and Priors](#likelihoods-and-priors)
12. [Reading the Saved Results](#reading-the-saved-results)
13. [How to Read the Outputs](#how-to-read-the-outputs)
14. [Diagnostics and Limitations](#diagnostics-and-limitations)
15. [Folder Structure](#folder-structure)
16. [How to Use This Project](#how-to-use-this-project)
17. [How to Run](#how-to-run)
18. [Figures](#figures)
19. [About the Author](#about-the-author)

---

## Overview

An MT2002 Statistical Modeling project that uses Bayesian models to study when restaurant tips rise, when tip percentages fall, and how sample size affects group estimates.

---

## What's Inside

| Resource | Open |
| --- | --- |
| Notebook | [Bayes_Models.ipynb](notebooks/Bayes_Models.ipynb) |
| Dataset | [tips.csv](data/tips.csv) |
| Data dictionary | [README.md](data/README.md) |
| Dependencies | [requirements.txt](requirements.txt) |
| Local webpage | [index.html](index.html) |

---

## Data and Exploration

The original course CSV was unavailable. The bundled public Tips dataset matches the stored schema and recorded summaries. See the [data dictionary and provenance](data/README.md).

The public dataset contains 244 restaurant bills and eight source columns. There are no missing values, and two records share the same measured fields. Tip amount is measured in dollars. Tip rate is the tip divided by the bill and multiplied by 100.

---

## Model Inventory

| Study | Models |
| --- | --- |
| Tip amount | Gaussian linear, Student-t linear, Gaussian with party size |
| Tip rate by group | Gaussian and Gamma by smoker status and four customer segments |
| Party-size estimates | Independent Gamma, fixed-spread hierarchical Gamma, learned-spread hierarchical Gamma |
| Tip-rate regression | Gaussian linear, Student-t linear, Gaussian and Student-t quadratic, and Gaussian with party size |

---

## Analysis Workflow

### Validate the input

Check the eight source columns, missing values, duplicated measurements, and counts by group. The bundled data has 244 bills, no missing values, and one duplicate pair when the row ID is excluded. Both records are retained.

### Choose the outcome

Tip amount is in dollars. Tip rate is 100 × tip ÷ total bill and is reported in percent. A regression slope for tip rate is measured in percentage points per additional dollar.

### Prepare the predictors

Tip amount models use the original bill in dollars. Tip-rate regressions center the bill around its observed mean of about $19.79. The quadratic term squares the centered bill. Party size stays on its original count scale.

### Encode the groups

Smoking status has 151 non-smoker and 93 smoker records. Customer segments combine recorded sex and smoking status. Party sizes 1–6 contain 4, 156, 38, 37, 5, and 4 bills respectively.

---

## Tip Amount Regression

Compare Gaussian and Student-t likelihoods for tip amount, then add party size. The saved bill slope is $0.105 per dollar in the Gaussian model (94% HDI $0.092–$0.119), $0.108 in the robust model, and $0.093 after adjusting for party size.

---

## Tip-Rate Group Comparisons

Smoker and non-smoker posterior means were close. The Gaussian model estimated substantially greater within-group spread among smokers. The analysis also compares four segments defined by sex and smoking status. All six saved 94% contrast intervals include zero.

---

## Hierarchical Party-Size Models

Compare independent estimates with two Gamma models that partially pool across six party sizes. Size 2 has 156 bills and size 1 has four. The learned-spread model moved the size-1 estimate from a sample mean of 21.73% toward 16.90%, with nine divergences in the saved run.

---

## Tip-Rate Regression

Model tip percentage against centered bill amount with Gaussian, Student-t, quadratic, and multivariable regressions. The saved Gaussian slope is −0.232 percentage points per dollar, while the Student-t slope is −0.182. The robust quadratic interval includes zero.

---

## Likelihoods and Priors

### Tip amount | Gaussian and Student-t

Expected tip = intercept + bill slope × bill. The intercept has a Normal prior with mean 0 and SD 2. The bill slope has mean 0 and SD 0.5, and residual scale is HalfNormal(2). The Student-t model adds degrees of freedom with an Exponential prior of mean 30. The multivariable model adds a party-size slope with Normal prior mean 0 and SD 1.

### Group means | Gaussian and Gamma

Gaussian group means use Normal priors with mean 16 and SD 10, with separate HalfNormal(10) scales. Gamma group means use HalfNormal(20). The two smoking groups share a HalfNormal(20) shape parameter, while the four segment models use separate HalfNormal(10) scales in the Gamma mean/SD parameterization.

### Party-size pooling | Three Gamma models

Independent groups use HalfNormal(20) priors for their means. The hierarchical variants draw group means from a Gamma distribution centered at a shared mean. The shared mean has a Gamma prior with mean 16 and SD 5. Between-group SD is fixed at 1 in one variant and learned with a HalfNormal(5) prior in the other.

### Tip rate | Linear, quadratic and adjusted

The baseline intercept has a Normal prior with mean 16 and SD 10. The bill slope uses Normal(0, SD 1), the quadratic term Normal(0, SD 0.1), and residual scale HalfNormal(10). The adjusted model uses intercept SD 15 and party-size slope SD 2. Student-t variants use the same degrees-of-freedom prior as the tip amount model.

---

## Reading the Saved Results

| Question | Quantity | Original notebook result |
| --- | --- | --- |
| Tip amount | Dollars per extra dollar of bill | $0.105 Gaussian, $0.108 Student-t, $0.093 after adjusting for party size. |
| Tip rate | Percentage points per extra dollar of bill | −0.232 Gaussian and −0.182 Student-t. Both slopes are negative in the saved run. |
| Customer segments | Difference in mean tip rate | All six pairwise 94% credible intervals include zero. |
| Party size | Mean tip rate for one-person parties | 21.73% observed, 16.90% in the learned-spread model. Four bills contribute to this group. |
| Model checking | Predictive shape and sampling | The Student-t predictive density better matches the observed peak. Nine divergences were reported for the learned-spread hierarchy. |

HDI means highest density interval. A posterior predictive check compares simulated and observed outcomes. Bayesian R² summarizes fitted variation and should be read alongside the predictive plots.

---

## How to Read the Outputs

### Posterior contrasts

For each pair of customer segments, subtract the group means draw by draw. Cohen’s d divides that difference by the root mean square of the two group SDs. Probability of superiority uses the fitted Gaussian distributions to estimate how often a draw from one group exceeds a draw from the other.

### Pooling and small groups

The forest plot compares independent, fixed-spread, and learned-spread estimates on the same scale. Small groups contribute less information, so their fitted means can move more toward the shared mean. The size-1 group contains four bills, compared with 156 for size 2.

### Sampling checks

The notebook defaults to four chains, 1,000 warmup iterations and 1,000 retained draws per chain, using seed 42. Trace plots show chain behavior. R-hat and effective sample size help assess agreement and Monte Carlo precision. Nine divergences in the original learned-spread run warrant caution with its scale estimate.

### Predictive checks and Bayesian R²

Predictive checks compare replicated outcomes with the observed distribution, including its spread and tails. The tip-rate R² calculation uses posterior draws of the expected mean. These checks answer different questions, and the notebook does not estimate performance on held-out bills.

### Interpretation boundaries

Recorded groups describe the dataset. Differences can reflect factors such as timing or bill composition. Gaussian models can generate negative rates, and the ratio outcome has the bill in its denominator. Use the saved plots to understand the observed sample and the fit assumptions.

---

## Diagnostics and Limitations

Compare traces, divergences, R-hat, effective sample sizes, posterior predictive distributions, and Bayesian R². Some Gaussian predictions fall below zero. The saved hierarchical divergences limit confidence in the learned between-group spread. The dataset is observational and the reported relationships are associations.

---

## Folder Structure

~~~text
Bayes_Models/
├── notebooks/Bayes_Models.ipynb
├── data/tips.csv
├── data/README.md
├── assets/                 Figures, thumbnails and page assets
├── requirements.txt
├── index.html
└── README.md
~~~

---

## How to Use This Project

1. Start with the saved results and the figure for the model you want to inspect.
2. Consult the data dictionary and priors for units, predictors, and assumptions.
3. Run the notebook on the bundled CSV and compare its diagnostics with the saved run.

---

## How to Run

~~~powershell
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python -m jupyterlab
~~~

Use Python 3.14 for the pinned dependencies. Open notebooks/Bayes_Models.ipynb in JupyterLab and run the cells in order. The notebook uses the bundled CSV, a fixed seed and four serial chains. The saved gallery describes the original run. Re-execution can produce different posterior estimates. The first run may take longer while PyTensor compiles model operations.

---

## Figures

24 equal-size captures from the original notebook outputs. The original executed submission is preserved in the separate Bayes_Models_Archive folder. Select an image for the full 1440 × 900 frame.

### Bill versus tip

[![Bill versus tip](assets/thumbs/01-bill-versus-tip.webp)](assets/screenshots/01-bill-versus-tip.png)

Larger bills generally received larger tips.

### Bill versus tip rate

[![Bill versus tip rate](assets/thumbs/02-bill-versus-tip-rate.webp)](assets/screenshots/02-bill-versus-tip-rate.png)

Several small bills have unusually high tip percentages.

### Gaussian regression traces

[![Gaussian regression traces](assets/thumbs/03-gaussian-regression-traces.webp)](assets/screenshots/03-gaussian-regression-traces.png)

Saved chain diagnostics for intercept, slope, and residual scale.

### Gaussian fitted line

[![Gaussian fitted line](assets/thumbs/04-gaussian-fitted-line.webp)](assets/screenshots/04-gaussian-fitted-line.png)

Posterior mean relationship and uncertainty for expected tips.

### Student-t regression traces

[![Student-t regression traces](assets/thumbs/05-student-t-regression-traces.webp)](assets/screenshots/05-student-t-regression-traces.png)

Heavy tails allow larger residuals.

### Gaussian versus Student-t

[![Gaussian versus Student-t](assets/thumbs/06-gaussian-versus-student-t.webp)](assets/screenshots/06-gaussian-versus-student-t.png)

The two fitted slopes are close.

### Multivariable traces

[![Multivariable traces](assets/thumbs/07-multivariable-traces.webp)](assets/screenshots/07-multivariable-traces.png)

Bill and party size enter the same tip amount model.

### Tip amount predictive checks

[![Tip amount predictive checks](assets/thumbs/08-tip-amount-predictive-checks.webp)](assets/screenshots/08-tip-amount-predictive-checks.png)

Compare predicted tip distributions with observations.

### Tip amount model fit

[![Tip amount model fit](assets/thumbs/09-tip-amount-model-fit.webp)](assets/screenshots/09-tip-amount-model-fit.png)

Saved Bayesian R² comparison.

### Smoker groups under Gaussian likelihood

[![Smoker groups under Gaussian likelihood](assets/thumbs/10-smoker-groups-under-gaussian-likelihood.webp)](assets/screenshots/10-smoker-groups-under-gaussian-likelihood.png)

Group-specific scales allow different spreads.

### Smoker groups under Gamma likelihood

[![Smoker groups under Gamma likelihood](assets/thumbs/11-smoker-groups-under-gamma-likelihood.webp)](assets/screenshots/11-smoker-groups-under-gamma-likelihood.png)

A shared shape constrains how the spread changes.

### Gaussian customer segments

[![Gaussian customer segments](assets/thumbs/12-gaussian-customer-segments.webp)](assets/screenshots/12-gaussian-customer-segments.png)

The four groups combine recorded sex and smoker status.

### Gamma customer segments

[![Gamma customer segments](assets/thumbs/13-gamma-customer-segments.webp)](assets/screenshots/13-gamma-customer-segments.png)

Positive likelihood with segment-specific mean and scale.

### Segment means

[![Segment means](assets/thumbs/14-segment-means.webp)](assets/screenshots/14-segment-means.png)

Compare the Gaussian and Gamma estimates across segments.

### Pairwise segment contrasts

[![Pairwise segment contrasts](assets/thumbs/15-pairwise-segment-contrasts.webp)](assets/screenshots/15-pairwise-segment-contrasts.png)

All six saved 94% intervals include zero.

### Smoker versus non-smoker contrast

[![Smoker versus non-smoker contrast](assets/thumbs/16-smoker-versus-non-smoker-contrast.webp)](assets/screenshots/16-smoker-versus-non-smoker-contrast.png)

The estimated difference is small relative to uncertainty.

### Between-size spread diagnostics

[![Between-size spread diagnostics](assets/thumbs/17-between-size-spread-diagnostics.webp)](assets/screenshots/17-between-size-spread-diagnostics.png)

Nine divergences were reported in the saved learned-spread run.

### Party-size forest plot

[![Party-size forest plot](assets/thumbs/18-party-size-forest-plot.webp)](assets/screenshots/18-party-size-forest-plot.png)

Separate estimates and two hierarchical models share a common scale.

### Gaussian tip-rate fit

[![Gaussian tip-rate fit](assets/thumbs/19-gaussian-tip-rate-fit.webp)](assets/screenshots/19-gaussian-tip-rate-fit.png)

The saved linear slope is about −0.232 percentage points per dollar.

### Robust tip-rate fit

[![Robust tip-rate fit](assets/thumbs/20-robust-tip-rate-fit.webp)](assets/screenshots/20-robust-tip-rate-fit.png)

The Student-t fit reduces the influence of extreme rates.

### Gaussian quadratic fit

[![Gaussian quadratic fit](assets/thumbs/21-gaussian-quadratic-fit.webp)](assets/screenshots/21-gaussian-quadratic-fit.png)

The Gaussian model suggests curvature.

### Robust quadratic comparison

[![Robust quadratic comparison](assets/thumbs/22-robust-quadratic-comparison.webp)](assets/screenshots/22-robust-quadratic-comparison.png)

The Student-t quadratic interval includes zero.

### Bill and party size

[![Bill and party size](assets/thumbs/23-bill-and-party-size.webp)](assets/screenshots/23-bill-and-party-size.png)

The adjusted party-size interval includes zero.

### Tip-rate predictive checks

[![Tip-rate predictive checks](assets/thumbs/24-tip-rate-predictive-checks.webp)](assets/screenshots/24-tip-rate-predictive-checks.png)

Compare the observed density with four model predictions.

---

## About the Author

Mohammad Rohaan · MT2002 Statistical Modeling · Fall 2026.

[GitHub profile](https://github.com/rohaan2802)
